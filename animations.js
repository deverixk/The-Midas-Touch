/* animations.js */

/* SCRAMBLE EFFECT */
function scrambleText(element, finalText, duration = 300) {
    const chars = "ABCEFGHIMNOPRSTUY"; 
    const steps = Math.max(1, finalText.length);
    let frame = 0;

    if (!element) return;

    const interval = setInterval(() => {
        let output = "";

        for (let i = 0; i < steps; i++) {
            if (i < frame) {
                output += finalText[i];
            } else {
                output += chars[Math.floor(Math.random() * chars.length)];
            }
        }

        element.textContent = output;

        frame++;

        if (frame > steps) {
            clearInterval(interval);
            element.textContent = finalText;
        }

    }, Math.max(50, Math.round(duration / steps)));
}

/* =====================================================
   ANIMACIÓN PRINCIPAL
   ===================================================== */

function startMainPageAnimation() {
    const main = document.getElementById("mainTitle");
    const sub = document.getElementById("subtitle");
    const scrollButton = document.getElementById("scrollButton");

    if (!main) return;

    main.style.opacity = "1";
    if (sub) sub.style.opacity = "1";

    const finalMain = main.dataset.final || main.textContent;
    const finalSub  = sub ? (sub.dataset.final || sub.textContent) : "";

    /* ================================
       NUEVO: TIEMPO DE TEXTO GRIEGO
       ================================ */
    const greekHold = 700;   //tiempo

    /* DURACIÓN DE SCRAMBLE */
    const scrambleMainDuration = 500;
    const scrambleSubDuration  = 500;

    /* --------------------------------------
       INICIO SCRAMBLE DEL TÍTULO PRINCIPAL
       -------------------------------------- */
    setTimeout(() => {
        scrambleText(main, finalMain, scrambleMainDuration);
    }, greekHold);

    /* --------------------------------------
       SUBTÍTULO – esperar a que termine main
       -------------------------------------- */
    if (sub) {
        setTimeout(() => {
            scrambleText(sub, finalSub, scrambleSubDuration);
        }, greekHold + scrambleMainDuration + 250);
    }

    /* --------------------------------------
       BOTÓN SCROLL
       -------------------------------------- */
    const totalAnimationTime = greekHold + scrambleMainDuration + 250 + scrambleSubDuration;
    
    if (scrollButton) {
        setTimeout(() => {
            scrollButton.classList.add('visible');
        }, totalAnimationTime + 1000);

        // Funcionalidad de redireccionamiento a main.html
        scrollButton.addEventListener('click', () => {
            window.location.href = 'main.html';
        });
    }
}

/* Export garantizar disponibilidad global */
window.startMainPageAnimation = startMainPageAnimation;

/* =====================================================
   MOSTRAR HEADER AL HACER SCROLL
   ===================================================== */

window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    const heroSection = document.getElementById('heroSection');
    
    if (!header || !heroSection) return;
    
    const heroHeight = heroSection.offsetHeight;
    const scrollPosition = window.scrollY;
    
    // Mostrar header cuando se pasa la sección hero
    if (scrollPosition > heroHeight - 100) {
        header.classList.add('visible');
    } else {
        header.classList.remove('visible');
    }
});

/* =====================================================
   SIDEBAR MÓVIL - FUNCIONALIDAD
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Función para abrir sidebar
    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        hamburgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    // Función para cerrar sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Event listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Cerrar sidebar al hacer click en un link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Cerrar sidebar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
});