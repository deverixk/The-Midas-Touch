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
            desc: "Tarjeta premium. Programable para contacto, redes sociales o URL personalizada, diseñada para tareas específicas, presiona para ver detalles.",
            precio: "$0"
        },
        {
            categoria: "SMART SERIES",
            titulo: "Tag NFC Adhesivo",
            desc: "Etiqueta adhesiva ultradelgada. Perfecta para prácticamente cualquier tarea, desde regalos hasta automatización del hogar y negocios.",
            precio: "$0"
        },
        {
            categoria: "EVENT SERIES",
            titulo: "Tarjeta de Entradas",
            desc: "Diseñada para accesos, eventos especiales o pases digitales con NFC, presiona para ver los detalles de personalización.",
            precio: "$0"
        },
        {
            categoria: "GIFT SERIES",
            titulo: "Llavero de Musica",
            desc: "Un llavero que puedes llevar a todos lados; al contacto con tu dispositivo, abre tu canción preferida o esa canción especial.",
            precio: "$0"
        },
        {
            categoria: "GIFT SERIES",
            titulo: "Llavero de parejas",
            desc: "Llavero especial revela los recuerdos más preciados; la canción que define una relación, una ubicación de primer encuentro o una fecha importante.",
            precio: "$0"
        },
        {
            categoria: "BUSINESS SERIES",
            titulo: "Menu Holder",
            desc: "Un holder menu perfecto para colocar en la mesa, o en cualquier lugar y que tus clientes puedan abrir el menú de tu establecimiento.",
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

    
 // Mapeo de productos a sus páginas
    const productPages = [
        'products_code/tarjeta-nfc.html',      // index 0
        'products_code/tag-nfc.html',          // index 1
        'products_code/entradas-nfc.html',     // index 2
        'products_code/llavero-disco.html',    // index 3
        'products_code/llavero-parejas.html',  // index 4
        'products_code/card-holder.html',      // index 5
        'products_code/proximamente.html'      // index 6
    ];

    // Event listener para el botón CTA "Ver detalles"
    const productoCTA = document.getElementById('productoCTA');
    if (productoCTA) {
        productoCTA.addEventListener('click', () => {
            window.location.href = productPages[currentIndex];
        });
    }

    // Event listener para click en el producto activo (modelo 3D)
    if (stack) {
        stack.addEventListener('click', (e) => {
            const activeProduct = document.querySelector('.producto-item.active');
            if (activeProduct && activeProduct.contains(e.target)) {
                const index = parseInt(activeProduct.getAttribute('data-index'));
                if (!isNaN(index) && productPages[index]) {
                    window.location.href = productPages[index];
                }
            }
        });
    }
});