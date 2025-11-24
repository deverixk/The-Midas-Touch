/* =====================================================
   SIDEBAR AVANZADO - DETECCIÓN DE SECCIÓN ACTIVA + SWIPE GESTURES
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // ===== 1. DETECCIÓN DE SECCIÓN ACTIVA =====
    
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Remover clase active de todos los links
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Agregar clase active al link correspondiente
                const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones
    sections.forEach(section => {
        observer.observe(section);
    });
    
    
});

/* =====================================================
   DROPDOWN MÓVIL - CLICK TOGGLE
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const sidebarDropdown = document.querySelector('.sidebar-dropdown');
    
    if (sidebarDropdown) {
        const dropdownLink = sidebarDropdown.querySelector('.sidebar-link');
        const dropdownArrow = dropdownLink.querySelector('.sidebar-arrow');
        
        // Click en la FLECHA abre/cierra (móvil)
        if (dropdownArrow && window.innerWidth <= 768) {
            dropdownArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Evita que se propague al link padre
                sidebarDropdown.classList.toggle('active');
            });
        }
        
        // Click en el LINK completo navega a catálogo (móvil)
        dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Si hace click fuera de la flecha, navegar
                if (!dropdownArrow.contains(e.target)) {
                    // Dejar que navegue normalmente
                    return;
                }
            }
        });
        
        // Cerrar sidebar al hacer click en subcategorías
        const sublinks = document.querySelectorAll('.sidebar-sublink');
        sublinks.forEach(sublink => {
            sublink.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                const sidebarOverlay = document.getElementById('sidebarOverlay');
                const hamburgerBtn = document.getElementById('hamburgerBtn');
                
                if (sidebar) sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                if (hamburgerBtn) hamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});