import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Any
from bson import ObjectId

from fastapi import FastAPI, HTTPException, Request, Response, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
import motor.motor_asyncio
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Colegio Técnico Romega API")

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if "*" not in CORS_ORIGINS else [],
    allow_origin_regex=".*" if "*" in CORS_ORIGINS else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
JWT_SECRET = os.environ.get("JWT_SECRET", "default_secret")
JWT_ALGORITHM = "HS256"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Password hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# JWT Functions
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Startup Event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up API...")
    # Create Indexes
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    
    # Seed Admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Administrador",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        logger.info(f"Admin user created with email: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated for: {admin_email}")

# Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class NewsItem(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    category: str = "General"
    event_date: Optional[str] = None

class ResourceItem(BaseModel):
    title: str
    file_url: str
    category: str # "estudiantes" or "docentes"
    description: Optional[str] = None
    subcategory: Optional[str] = None

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class AdmissionRequest(BaseModel):
    student_name: str
    student_grade: str
    parent_name: str
    email: EmailStr
    phone: str
    comments: Optional[str] = None

# Auth Routes
@app.post("/api/auth/login")
async def login(req: LoginRequest, response: Response, request: Request):
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{req.email.lower()}"
    
    # Check brute force
    recent_attempts = await db.login_attempts.count_documents({
        "identifier": identifier,
        "timestamp": {"$gt": datetime.now(timezone.utc) - timedelta(minutes=15)}
    })
    
    if recent_attempts >= 5:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        
    user = await db.users.find_one({"email": req.email.lower()})
    
    if not user or not verify_password(req.password, user["password_hash"]):
        await db.login_attempts.insert_one({
            "identifier": identifier,
            "timestamp": datetime.now(timezone.utc)
        })
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Clear attempts
    await db.login_attempts.delete_many({"identifier": identifier})
    
    access_token = create_access_token(str(user["_id"]), user["email"])
    refresh_token = create_refresh_token(str(user["_id"]))
    
    # Use SameSite None for cross-origin testing, otherwise Lax
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    user["_id"] = str(user["_id"])
    user.pop("password_hash", None)
    return user

@app.post("/api/auth/logout")
async def logout(response: Response, user: dict = Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@app.get("/api/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

# Public Routes
@app.get("/api/news")
async def get_news():
    cursor = db.news.find().sort("created_at", -1)
    news = await cursor.to_list(length=100)
    for n in news:
        n["id"] = str(n.pop("_id"))
    return {"data": news}

@app.get("/api/resources")
async def get_resources():
    cursor = db.resources.find().sort("created_at", -1)
    resources = await cursor.to_list(length=100)
    for r in resources:
        r["id"] = str(r.pop("_id"))
    return {"data": resources}

@app.post("/api/contact")
async def submit_contact(msg: ContactMessage):
    # Enfoque híbrido: Guardar en base de datos
    new_msg = {
        **msg.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "status": "unread"
    }
    result = await db.contact_messages.insert_one(new_msg)
    
    # Aquí se integraría Resend en el futuro (Simulación por ahora)
    logger.info(f"Simulando envío de correo de notificación: Nuevo mensaje de {msg.name}")
    
    return {"message": "Mensaje enviado y guardado correctamente."}

@app.post("/api/admissions")
async def submit_admission(adm: AdmissionRequest):
    new_adm = {
        **adm.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "status": "pending"
    }
    result = await db.admissions.insert_one(new_adm)
    logger.info(f"Nueva pre-inscripción: {adm.student_name}")
    return {"message": "Pre-inscripción enviada correctamente."}

# Admin Routes
@app.post("/api/news")
async def create_news(news: NewsItem, user: dict = Depends(require_admin)):
    doc = news.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["created_by"] = user["_id"]
    res = await db.news.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return doc

@app.put("/api/news/{id}")
async def update_news(id: str, news: NewsItem, user: dict = Depends(require_admin)):
    doc = news.model_dump()
    result = await db.news.update_one({"_id": ObjectId(id)}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    doc["id"] = id
    return doc

@app.delete("/api/news/{id}")
async def delete_news(id: str, user: dict = Depends(require_admin)):
    result = await db.news.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "Deleted"}

@app.post("/api/resources")
async def create_resource(res: ResourceItem, user: dict = Depends(require_admin)):
    doc = res.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["created_by"] = user["_id"]
    result = await db.resources.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc

@app.put("/api/resources/{id}")
async def update_resource(id: str, res: ResourceItem, user: dict = Depends(require_admin)):
    doc = res.model_dump()
    result = await db.resources.update_one({"_id": ObjectId(id)}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    doc["id"] = id
    return doc

@app.delete("/api/resources/{id}")
async def delete_resource(id: str, user: dict = Depends(require_admin)):
    result = await db.resources.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Deleted"}

@app.get("/api/contact-messages")
async def get_contact_messages(user: dict = Depends(require_admin)):
    cursor = db.contact_messages.find().sort("created_at", -1)
    messages = await cursor.to_list(length=100)
    for m in messages:
        m["id"] = str(m.pop("_id"))
    return {"data": messages}

@app.put("/api/contact-messages/{id}/read")
async def mark_message_read(id: str, user: dict = Depends(require_admin)):
    result = await db.contact_messages.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "read"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Marked as read"}

@app.get("/api/admissions")
async def get_admissions(user: dict = Depends(require_admin)):
    cursor = db.admissions.find().sort("created_at", -1)
    admissions = await cursor.to_list(length=100)
    for a in admissions:
        a["id"] = str(a.pop("_id"))
    return {"data": admissions}

@app.put("/api/admissions/{id}/status")
async def update_admission_status(id: str, status_data: dict, user: dict = Depends(require_admin)):
    new_status = status_data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status required")
    result = await db.admissions.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": new_status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Admission request not found")
    return {"message": "Status updated"}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
