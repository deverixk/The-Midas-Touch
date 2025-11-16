/* ==========================
   SPOTLIGHT HOVER + TOUCH
   ========================== */

document.addEventListener("DOMContentLoaded", () => {
    const imgs = document.querySelectorAll(".spotlight-img");

    if (!imgs.length) return;

    const section = document.getElementById("heroSection");

    function updateSpotlight(x, y) {
        imgs.forEach(img => {
            img.style.setProperty("--spot-x", x + "px");
            img.style.setProperty("--spot-y", y + "px");
            img.classList.add("spotlight-reveal");
        });
    }

    function resetSpotlight() {
        imgs.forEach(img => img.classList.remove("spotlight-reveal"));
    }

    /* 🖱 Mouse */
    section.addEventListener("mousemove", (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateSpotlight(x, y);
    });

    section.addEventListener("mouseleave", () => {
        resetSpotlight();
    });

    section.addEventListener("touchmove", (e) => {
        const rect = section.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        updateSpotlight(x, y);
    });

    section.addEventListener("touchend", () => {
        resetSpotlight();
    });
});

/* ==== Spotlight Atmosférico */

const spotlight = document.getElementById("atmosSpotlight");

let spotX = window.innerWidth / 2;
let spotY = window.innerHeight / 2;

let targetX = spotX;
let targetY = spotY;

let lastMoveTime = 0;
const inactivityFade = 1200;

function animateSpotlight() {
    // LERP para suavidad extrema
    spotX += (targetX - spotX) * 0.2;
    spotY += (targetY - spotY) * 0.2;

    spotlight.style.left = `${spotX}px`;
    spotlight.style.top = `${spotY}px`;

    // Revisar inactividad
    const elapsed = Date.now() - lastMoveTime;
    spotlight.style.opacity = elapsed > inactivityFade ? "0" : "1";

    requestAnimationFrame(animateSpotlight);
}
animateSpotlight();

// Desktop
window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    lastMoveTime = Date.now();
});

// Mobile
window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    targetX = t.clientX;
    targetY = t.clientY;
    lastMoveTime = Date.now();
});
