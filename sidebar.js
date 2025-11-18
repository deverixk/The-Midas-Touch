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