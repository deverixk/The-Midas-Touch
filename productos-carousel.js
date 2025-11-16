/* =====================================================
   CAROUSEL 3D - PRODUCTOS CON EFECTO DE PROFUNDIDAD
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('carousel3dPrev');
    const nextBtn = document.getElementById('carousel3dNext');
    const items = document.querySelectorAll('.producto-item');
    const stack = document.querySelector('.productos-stack');
    
    if (!items.length) return;
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    // Datos de los productos
    const productosData = [
        {
            categoria: "PREMIUM SERIES",
            titulo: "Tarjeta NFC",
            desc: "Tarjeta premium. Programable para contacto, redes sociales o URL personalizada.",
            precio: "$0"
        },
        {
            categoria: "SMART SERIES",
            titulo: "Tag NFC Adhesivo",
            desc: "Etiqueta adhesiva ultradelgada. Perfecta para practicamente cualquier tarea, desde regalos hasta automatización del hogar, negocios y menús digitales.",
            precio: "$0"
        },
        {
            categoria: "PROXIMAMENTE",
            titulo: "Proximamente",
            desc: "Proximamente.",
            precio: "$0"
        },
        {
            categoria: "PROXIMAMENTE",
            titulo: "Proximamente",
            desc: "Proximamente.",
            precio: "$0"
        },
    ];
    
    // Actualizar clases de posición
    function updatePositions() {
        items.forEach((item, index) => {
            // Remover todas las clases
            item.classList.remove('active', 'next-1', 'next-2', 'hidden');
            
            // Calcular posición relativa
            let relativePos = (index - currentIndex + totalItems) % totalItems;
            
            if (relativePos === 0) {
                item.classList.add('active');
            } else if (relativePos === 1) {
                item.classList.add('next-1');
            } else if (relativePos === 2) {
                item.classList.add('next-2');
            } else {
                item.classList.add('hidden');
            }
        });
        
        updateDetails();
    }
    
    // Actualizar detalles del producto
    function updateDetails() {
        const data = productosData[currentIndex];
        
        const categoria = document.getElementById('productoCategoria');
        const titulo = document.getElementById('productoTitulo');
        const desc = document.getElementById('productoDesc');
        const precio = document.getElementById('productoPrecio');
        
        if (categoria) categoria.textContent = data.categoria;
        if (titulo) titulo.textContent = data.titulo;
        if (desc) desc.textContent = data.desc;
        if (precio) precio.textContent = data.precio;
    }
    
    // Navegar al siguiente
    function goNext() {
        currentIndex = (currentIndex + 1) % totalItems;
        updatePositions();
    }
    
    // Navegar al anterior
    function goPrev() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updatePositions();
    }
    
    // Event listeners para botones
    if (nextBtn) {
        nextBtn.addEventListener('click', goNext);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goPrev);
    }
    
    // ===== TOUCH/SWIPE SUPPORT =====
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;
    
    if (stack) {
        stack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        stack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left → siguiente
                goNext();
            } else {
                // Swipe right → anterior
                goPrev();
            }
        }
    }
    
    // ===== NAVEGACIÓN CON TECLADO =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goPrev();
        } else if (e.key === 'ArrowRight') {
            goNext();
        }
    });
    
    // ===== AUTOPLAY (COMENTADO - OPCIONAL) =====
    /*
    let autoplayInterval;
    const autoplayDelay = 4000; // 4 segundos
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goNext();
        }, autoplayDelay);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Iniciar autoplay
    startAutoplay();
    
    // Detener al interactuar
    const carousel = document.querySelector('.productos-carousel-3d');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Detener en touch
        carousel.addEventListener('touchstart', stopAutoplay);
    }
    
    // Pausar cuando el botón es clickeado
    if (nextBtn) nextBtn.addEventListener('click', () => {
        stopAutoplay();
        setTimeout(startAutoplay, autoplayDelay * 2);
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        stopAutoplay();
        setTimeout(startAutoplay, autoplayDelay * 2);
    });
    */
    
    // Inicializar
    updatePositions();
});