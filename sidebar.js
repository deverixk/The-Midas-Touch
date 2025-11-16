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
    
    
    // ===== 2. SWIPE GESTURES =====
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let isSwiping = false;
    let swipeDirection = null;
    let startTime = 0;
    
    const SWIPE_THRESHOLD = 100; // Píxeles mínimos para activar swipe
    const VELOCITY_THRESHOLD = 0.5; // Velocidad mínima para flick
    const EDGE_ZONE = 30; // Zona del borde para abrir (píxeles)
    
    // ===== A) ABRIR DESDE BORDE DERECHO =====
    
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const screenWidth = window.innerWidth;
        
        // Detectar si el touch está en la zona del borde derecho
        if (touch.clientX >= screenWidth - EDGE_ZONE && !sidebar.classList.contains('active')) {
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isSwiping = true;
            swipeDirection = 'opening';
            startTime = Date.now();
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isSwiping || swipeDirection !== 'opening') return;
        
        const touch = e.touches[0];
        touchCurrentX = touch.clientX;
        touchCurrentY = touch.clientY;
        
        const deltaX = touchStartX - touchCurrentX;
        const deltaY = Math.abs(touchStartY - touchCurrentY);
        
        // Verificar que es un swipe horizontal (no vertical)
        if (deltaY < 50 && deltaX > 0) {
            // Mover el sidebar proporcionalmente
            const translateValue = Math.max(-320, -deltaX);
            sidebar.style.transition = 'none';
            sidebar.style.right = `${translateValue}px`;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (!isSwiping || swipeDirection !== 'opening') return;
        
        const deltaX = touchStartX - touchCurrentX;
        const deltaTime = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / deltaTime;
        
        // Abrir si supera el umbral o tiene velocidad suficiente
        if (deltaX > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
            sidebar.style.transition = '';
            sidebar.classList.add('active');
            document.getElementById('sidebarOverlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            // Volver a cerrar
            sidebar.style.transition = '';
            sidebar.style.right = '-320px';
        }
        
        isSwiping = false;
        swipeDirection = null;
    });
    
    
    // ===== B) CERRAR SIDEBAR CON SWIPE HACIA LA DERECHA =====
    
    sidebar.addEventListener('touchstart', (e) => {
        if (!sidebar.classList.contains('active')) return;
        
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isSwiping = true;
        swipeDirection = 'closing';
        startTime = Date.now();
    }, { passive: true });
    
    sidebar.addEventListener('touchmove', (e) => {
        if (!isSwiping || swipeDirection !== 'closing') return;
        
        const touch = e.touches[0];
        touchCurrentX = touch.clientX;
        touchCurrentY = touch.clientY;
        
        const deltaX = touchCurrentX - touchStartX;
        const deltaY = Math.abs(touchCurrentY - touchStartY);
        
        // Verificar que es un swipe horizontal hacia la derecha
        if (deltaY < 50 && deltaX > 0) {
            e.preventDefault();
            
            // Mover el sidebar
            const translateValue = Math.min(0, -320 + deltaX);
            sidebar.style.transition = 'none';
            sidebar.style.right = `${translateValue}px`;
            
            // Desvanecer overlay proporcionalmente
            const overlay = document.getElementById('sidebarOverlay');
            const opacity = Math.max(0, 1 - (deltaX / 320));
            overlay.style.opacity = opacity;
        }
    });
    
    sidebar.addEventListener('touchend', () => {
        if (!isSwiping || swipeDirection !== 'closing') return;
        
        const deltaX = touchCurrentX - touchStartX;
        const deltaTime = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / deltaTime;
        
        const overlay = document.getElementById('sidebarOverlay');
        
        // Cerrar si supera el umbral o tiene velocidad suficiente
        if (deltaX > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
            sidebar.style.transition = '';
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            overlay.style.opacity = '';
            document.body.style.overflow = '';
            document.getElementById('hamburgerBtn').classList.remove('active');
        } else {
            // Volver a abrir
            sidebar.style.transition = '';
            sidebar.style.right = '0';
            overlay.style.opacity = '1';
        }
        
        isSwiping = false;
        swipeDirection = null;
    });
    
    
    // ===== PREVENIR CONFLICTOS CON SCROLL VERTICAL =====
    
    let lastTouchY = 0;
    
    sidebar.addEventListener('touchstart', (e) => {
        lastTouchY = e.touches[0].clientY;
    }, { passive: true });
    
    sidebar.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const deltaY = Math.abs(currentY - lastTouchY);
        
        // Si el movimiento es más vertical que horizontal, permitir scroll
        const deltaX = Math.abs(touchCurrentX - touchStartX);
        if (deltaY > deltaX) {
            isSwiping = false;
        }
        
        lastTouchY = currentY;
    }, { passive: true });
});