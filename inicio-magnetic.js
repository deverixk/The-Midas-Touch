/* =====================================================
   EFECTO MAGNÉTICO 3D PARA CARDS
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const magneticCards = document.querySelectorAll('[data-magnetic]');
    
    if (magneticCards.length === 0) return;
    
    // Solo aplicar efecto en desktop
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;
    
    magneticCards.forEach(card => {
        let cardRect = card.getBoundingClientRect();
        
        // Actualizar rect en resize
        window.addEventListener('resize', () => {
            cardRect = card.getBoundingClientRect();
        });
        
        // Mouse move sobre la card
        card.addEventListener('mousemove', (e) => {
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            // Calcular rotación (máximo ±15 grados)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            // Calcular elevación (scale ligeramente)
            const scale = 1.02;
            
            // Aplicar transformación
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(${scale})
                translateZ(10px)
            `;
            
            // Mover sombra según posición del mouse
            const shadowX = ((x - centerX) / centerX) * 20;
            const shadowY = ((y - centerY) / centerY) * 20;
            
            card.style.boxShadow = `
                ${shadowX}px ${shadowY}px 40px rgba(212, 175, 55, 0.3),
                0 0 20px rgba(212, 175, 55, 0.1)
            `;
        });
        
        // Mouse leave - resetear
        card.addEventListener('mouseleave', () => {
            card.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                scale(1)
                translateZ(0px)
            `;
            
            card.style.boxShadow = '';
            
            // Transición suave al resetear
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
            
            // Remover transición después para que el efecto sea fluido
            setTimeout(() => {
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 500);
        });
        
        // Mouse enter - preparar para efecto
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
            cardRect = card.getBoundingClientRect();
        });
    });
    
    // Smooth scroll para el botón CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(ctaButton.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    }
    
    // Intersection Observer para animar cards al entrar al viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar todas las cards
    document.querySelectorAll('.card-hero, .card-small').forEach(card => {
        observer.observe(card);
    });
});