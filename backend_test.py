import requests
import sys
import json
from datetime import datetime

class RomegaAPITester:
    def __init__(self, base_url="https://romega-academy.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.cookies = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Use session cookies for authentication
        if auth_required and self.cookies:
            self.session.cookies.update(self.cookies)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.content:
                    try:
                        resp_json = response.json()
                        print(f"   Response: {json.dumps(resp_json, indent=2)[:200]}...")
                    except:
                        print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}")

            return success, response.json() if response.content and response.headers.get('content-type', '').startswith('application/json') else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_login(self, email, password):
        """Test login and get cookies"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success:
            # Store cookies from the response
            self.cookies = self.session.cookies.get_dict()
            print(f"   Cookies stored: {list(self.cookies.keys())}")
            return True
        return False

    def test_public_endpoints(self):
        """Test all public endpoints"""
        print("\n=== TESTING PUBLIC ENDPOINTS ===")
        
        # Test get news
        self.run_test("Get News", "GET", "api/news", 200)
        
        # Test get resources
        self.run_test("Get Resources", "GET", "api/resources", 200)
        
        # Test contact form submission
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test message from automated testing."
        }
        self.run_test("Submit Contact Form", "POST", "api/contact", 200, data=contact_data)

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n=== TESTING AUTH ENDPOINTS ===")
        
        # Test login with correct credentials
        login_success = self.test_login("admin@colegioromega.edu.co", "admin_romega_pass")
        
        if login_success:
            # Test /me endpoint
            self.run_test("Get Current User", "GET", "api/auth/me", 200, auth_required=True)
            
            # Test logout
            self.run_test("Logout", "POST", "api/auth/logout", 200, auth_required=True)
        
        # Test login with wrong credentials
        self.run_test(
            "Login with Wrong Password", 
            "POST", 
            "api/auth/login", 
            401, 
            data={"email": "admin@colegioromega.edu.co", "password": "wrong_password"}
        )

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n=== TESTING ADMIN ENDPOINTS ===")
        
        # Login first
        if not self.test_login("admin@colegioromega.edu.co", "admin_romega_pass"):
            print("❌ Cannot test admin endpoints - login failed")
            return
        
        # Test create news
        news_data = {
            "title": "Test News Article",
            "content": "This is a test news article created by automated testing.",
            "category": "General",
            "image_url": "https://example.com/test-image.jpg"
        }
        success, news_response = self.run_test("Create News", "POST", "api/news", 200, data=news_data, auth_required=True)
        news_id = news_response.get("id") if success else None
        
        # Test create resource
        resource_data = {
            "title": "Test Resource",
            "file_url": "https://example.com/test-resource.pdf",
            "category": "estudiantes",
            "description": "This is a test resource for students."
        }
        success, resource_response = self.run_test("Create Resource", "POST", "api/resources", 200, data=resource_data, auth_required=True)
        resource_id = resource_response.get("id") if success else None
        
        # Test get contact messages
        self.run_test("Get Contact Messages", "GET", "api/contact-messages", 200, auth_required=True)
        
        # Test mark message as read (we'll use a dummy ID)
        # This might fail if no messages exist, which is expected
        self.run_test("Mark Message as Read", "PUT", "api/contact-messages/507f1f77bcf86cd799439011/read", 404, auth_required=True)
        
        # Clean up - delete created items
        if news_id:
            self.run_test("Delete News", "DELETE", f"api/news/{news_id}", 200, auth_required=True)
        
        if resource_id:
            self.run_test("Delete Resource", "DELETE", f"api/resources/{resource_id}", 200, auth_required=True)

    def test_unauthorized_access(self):
        """Test that admin endpoints require authentication"""
        print("\n=== TESTING UNAUTHORIZED ACCESS ===")
        
        # Clear cookies
        self.cookies = {}
        self.session.cookies.clear()
        
        # Try to access admin endpoints without auth
        self.run_test("Unauthorized Create News", "POST", "api/news", 401, 
                     data={"title": "Test", "content": "Test"})
        
        self.run_test("Unauthorized Get Contact Messages", "GET", "api/contact-messages", 401)

def main():
    print("🚀 Starting Colegio Técnico Romega API Tests")
    print("=" * 50)
    
    tester = RomegaAPITester()
    
    # Run all test suites
    tester.test_public_endpoints()
    tester.test_auth_endpoints()
    tester.test_admin_endpoints()
    tester.test_unauthorized_access()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed - check logs above")
        return 1

if __name__ == "__main__":
    sys.exit(main())