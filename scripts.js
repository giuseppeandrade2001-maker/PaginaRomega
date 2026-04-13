document.addEventListener("DOMContentLoaded", () => {
  // Inicializar Iconos de Lucide
  lucide.createIcons();

  // --- NAVEGACIÓN Y MENÚ ---
  const sections = document.querySelectorAll(".page-section");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggle = document.getElementById("menu-toggle");

  function navigateTo(hash) {
    const targetId = hash ? hash.substring(1) : "inicio";
    let found = false;

    // Mostrar sección correcta
    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.remove("hidden-section");
        found = true;
      } else {
        sec.classList.add("hidden-section");
      }
    });

    // Fallback a inicio si el hash no existe
    if (!found && sections.length > 0) {
      document.getElementById("inicio").classList.remove("hidden-section");
    }

    // Actualizar colores de los enlaces activos
    navLinks.forEach(link => {
      const linkHash = link.getAttribute("href").substring(1) || "inicio";
      if (linkHash === targetId) {
        link.classList.add("text-blue-700");
        link.classList.remove("text-slate-600");
      } else {
        link.classList.remove("text-blue-700");
        link.classList.add("text-slate-600");
      }
    });

    // Hacer scroll al principio de la página al cambiar de sección
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cerrar menú móvil si está abierto
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }
  }

  // Escuchar cambios en la URL (al dar clic en enlaces)
  window.addEventListener("hashchange", () => {
    navigateTo(window.location.hash);
  });

  // Toggle menú móvil
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Carga inicial
  navigateTo(window.location.hash);
});

// --- PESTAÑAS (TABS) PARA RECURSOS ---
function filterResources(category) {
  const cards = document.querySelectorAll('.resource-card');
  const tabs = document.querySelectorAll('.resource-tab');

  cards.forEach(card => {
    if (card.dataset.category === category || category === 'todas') {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
  
  tabs.forEach(tab => {
    if (tab.dataset.target === category) {
      tab.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      tab.classList.remove('bg-white', 'text-slate-600');
    } else {
      tab.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
      tab.classList.add('bg-white', 'text-slate-600');
    }
  });
}

// --- FORMULARIOS (Simulación visual de envío) ---
function handleContactSubmit(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;
  
  btn.innerText = "Enviando...";
  btn.disabled = true;
  btn.classList.add("opacity-75", "cursor-not-allowed");
  
  setTimeout(() => {
    btn.innerText = "¡Mensaje Enviado!";
    btn.classList.replace("bg-blue-700", "bg-emerald-600");
    btn.classList.replace("hover:bg-blue-800", "hover:bg-emerald-700");
    event.target.reset();
    
    // Restaurar el botón tras 3 segundos
    setTimeout(() => {
      btn.innerText = originalText;
      btn.classList.replace("bg-emerald-600", "bg-blue-700");
      btn.classList.replace("hover:bg-emerald-700", "hover:bg-blue-800");
      btn.disabled = false;
      btn.classList.remove("opacity-75", "cursor-not-allowed");
    }, 3000);
  }, 1500);
}

function handleAdmissionsSubmit(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;
  
  btn.innerText = "Enviando...";
  btn.disabled = true;
  btn.classList.add("opacity-75", "cursor-not-allowed");
  
  setTimeout(() => {
    btn.innerText = "¡Pre-inscripción Enviada!";
    btn.classList.replace("bg-blue-700", "bg-emerald-600");
    btn.classList.replace("hover:bg-blue-800", "hover:bg-emerald-700");
    
    // Mostrar recuadro de éxito estático
    const successBox = document.getElementById("admisiones-success");
    if(successBox) successBox.classList.remove("hidden");
    
    event.target.reset();
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.classList.replace("bg-emerald-600", "bg-blue-700");
      btn.classList.replace("hover:bg-emerald-700", "hover:bg-blue-800");
      btn.disabled = false;
      btn.classList.remove("opacity-75", "cursor-not-allowed");
      if(successBox) successBox.classList.add("hidden");
    }, 5000);
  }, 1500);
}
