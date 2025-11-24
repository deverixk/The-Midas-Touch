/* =====================================================
   CÓMO FUNCIONA - FUNCIONALIDAD
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== VIDEO PLAYER =====
    const playButton = document.getElementById('playButton');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const video = document.getElementById('nfcDemoVideo');
    
    if (playButton && video && videoThumbnail) {
        const playVideo = () => {
            videoThumbnail.classList.add('hidden');
            video.classList.add('playing');
            video.play();
        };
        
        playButton.addEventListener('click', playVideo);
        videoThumbnail.addEventListener('click', playVideo);
        
        video.addEventListener('ended', () => {
            video.classList.remove('playing');
            videoThumbnail.classList.remove('hidden');
            video.currentTime = 0;
        });
    }
    
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Cerrar todos los FAQs
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Abrir el clickeado si no estaba activo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // ===== ANIMACIÓN DE ENTRADA AL SCROLL =====
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
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll(
        '.step-item, .feature-card, .comparison-column, .faq-item'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});