// ===== LOADER 3D CON THREE.JS (ADAPTADO PARA COMPORTARSE COMO TU OTRO SCRIPT) =====

let scene, camera, renderer, logo3D;
let animationComplete = false;
let pmremGenerator;

function init3DLoader() {
    const container = document.getElementById('canvas3D');

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0A0A); // Negro

    // Cámara
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer (mejor configuración para PBR)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // PMREM + RoomEnvironment (importantísimo para materiales metálicos/dorados)
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

//  ILUMINACIÓN ORO PURO 

// Luz ambiental mínima, amarilla suave
const ambient = new THREE.AmbientLight(0xFFCD00, 0.22);
scene.add(ambient);

// Luz principal: dorado puro y brillante
const key = new THREE.DirectionalLight(0xFFCD00, 1.45);
key.position.set(6, 7, 5);
scene.add(key);

// Luz lateral para rellenar sombras sin cambiar el color
const fill = new THREE.DirectionalLight(0xE6B800, 0.65); 
fill.position.set(-5, 3, 3);
scene.add(fill);

// Luz de contorno (rim light) para el borde dorado
const rim = new THREE.DirectionalLight(0xFFE066, 0.95);
rim.position.set(-4, 6, -4);
scene.add(rim);

// Punto cálido para crear brillos realistas
const point = new THREE.PointLight(0xFFCD00, 1.6, 14);
point.position.set(0, 1.2, 3);
scene.add(point);

// Spot concentrado que genera el degradado dorado
const spot = new THREE.SpotLight(0xFFCD00, 1.25, 25, Math.PI / 5, 0.45);
spot.position.set(3, 5, 4);
scene.add(spot);


    // Cargar modelo GLB
    const loader = new THREE.GLTFLoader();

    loader.load(
        'Logo_The_Midas_Touch.glb', // tu ruta
        function(gltf) {
            logo3D = gltf.scene;

            // --- ESCALADO Y CENTRADO (copiado/adaptado del script que funciona) ---
            // Calcula caja, escala relativa y centra el modelo
            const box = new THREE.Box3().setFromObject(logo3D);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const desiredSize = 1.95; // puedes ajustar este valor si quieres el modelo más grande/pequeño
            const scale = desiredSize / maxDim;
            logo3D.scale.setScalar(scale);

            // recalcular box/centro después del escalado
            box.setFromObject(logo3D);
            const center = box.getCenter(new THREE.Vector3());
            logo3D.position.sub(center); // centrar en 0,0,0

            // Ajustar cámara en base al bounding sphere (igual que en el otro script)
            const sphere = box.getBoundingSphere(new THREE.Sphere());
            const radius = sphere.radius;
            const distance = (radius * 1.15) / Math.sin((camera.fov * Math.PI) / 360);
            const basePosition = new THREE.Vector3(center.x, center.y, center.z + distance * 0.9);

            if (window.innerWidth <= 768) {
                camera.position.set(center.x, center.y + 0.1, center.z + distance * 1.2);
            } else {
                camera.position.copy(basePosition);
            }

            camera.lookAt(center);
            camera.updateProjectionMatrix();

            // Añadir el modelo a la escena (ya escalado y centrado)
            scene.add(logo3D);

            // Imprime materiales (útil para debugging)
            logo3D.traverse((child) => {
                if (child.isMesh) {
                    console.log("Material del mesh:", child.material);
                }
            });

            // Iniciar animación DE ENTRADA (NUEVO: aparece centrado, gira rápido y se acomoda sobre el PNG)
            startEntryAnimation();
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% cargado');
        },
        function(error) {
            console.error('Error al cargar el modelo 3D:', error);
            fallbackToMainPage();
        }
    );

    // Responsive
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ----------------- ANIMACIÓN DE ENTRADA (REEMPLAZADA) -----------------
function startEntryAnimation() {
    if (!logo3D) return;

    // 1) El modelo arranca ya centrado (no viene desde abajo)
    logo3D.position.set(0, 0, 0);
    // mantener la rotación actual como base
    const initialRotation = logo3D.rotation.clone();
    const baseScale = logo3D.scale.x || 1;

    // 2) Giro rápido inicial (600ms) con pulso de escala
    const spinDuration = 1800;
    const spinStart = performance.now();
    let spinDone = false;

    function spinFrame(now) {
        const elapsed = now - spinStart;
        const t = Math.min(elapsed / spinDuration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic-like

        // 3 vueltas (3 * 2π) -> usar 3 vueltas
        logo3D.rotation.y = initialRotation.y + eased * Math.PI * 6;

        // pulso de escala
        const pulse = 1 + 0.12 * (1 - Math.abs(0.5 - eased) * 2);
        logo3D.scale.setScalar(baseScale * pulse);

        renderer.render(scene, camera);

        if (t < 1) {
            requestAnimationFrame(spinFrame);
        } else {
            // normalizamos escala al baseScale
            logo3D.scale.setScalar(baseScale);
            spinDone = true;
            // pequeña pausa antes de transicionar (100ms)
            setTimeout(() => {
                transitionModelToLogoPNG(800); // 800ms para acomodarse en el PNG
            }, 100);
        }
    }
    requestAnimationFrame(spinFrame);
}

// ----------------- FUNCIONES AUXILIARES PARA POSICIÓN/ESCALA RELATIVA AL PNG -----------------

// Convierte el centro del DOM element (.nfc-logo img) a una posición en el mundo 3D
function domElementCenterToWorld(el, depthRatio = 0.6) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const ndcX = (cx / window.innerWidth) * 2 - 1;
    const ndcY = - (cy / window.innerHeight) * 2 + 1;

    // punto en NDC a profundidad intermedia (z en NDC cercano a 0.5)
    const ndc = new THREE.Vector3(ndcX, ndcY, 0.5);
    ndc.unproject(camera);

    // dirección desde la cámara hacia el punto unprojected
    const dir = ndc.sub(camera.position).normalize();

    // distancia base desde cámara al origen (modelo centrado en 0,0,0)
    const baseDistance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) || 5;
    const distance = baseDistance * depthRatio; // ajusta cuánto "adelantar" hacia cámara

    return camera.position.clone().add(dir.multiplyScalar(distance));
}

// calcula la anchura en unidades mundo que corresponde a un ancho en píxeles del DOM element a cierta profundidad
function pixelWidthToWorldWidth(el, pxWidth, depthRatio = 0.6) {
    const rect = el.getBoundingClientRect();
    const leftPx = rect.left;
    const rightPx = rect.left + pxWidth;
    const cy = rect.top + rect.height / 2;

    const ndcLeft = new THREE.Vector3((leftPx / window.innerWidth) * 2 - 1, - (cy / window.innerHeight) * 2 + 1, 0.5);
    const ndcRight = new THREE.Vector3((rightPx / window.innerWidth) * 2 - 1, - (cy / window.innerHeight) * 2 + 1, 0.5);

    ndcLeft.unproject(camera);
    ndcRight.unproject(camera);

    return ndcLeft.distanceTo(ndcRight);
}

// Transición que interpola posición, rotación y escala para "acomodar" el modelo sobre el PNG
function transitionModelToLogoPNG(durationMs = 800) {
    const el = document.querySelector('.nfc-logo img');
    if (!el) {
        console.warn('Elemento .nfc-logo img no encontrado. Se salta la transición a PNG.');
        renderer.render(scene, camera);
        animationComplete = true;
        finishLoader();
        return;
    }

    // pixel objetivo del PNG (alto en px)
    const targetPixelHeight = el.getBoundingClientRect().height || 220;

    // posición y escala objetivo en mundo
    const targetPos = domElementCenterToWorld(el, 0.6);
    const targetWorldWidth = pixelWidthToWorldWidth(el, el.getBoundingClientRect().width, 0.6);

    // caja actual y ancho actual (en world)
    const box = new THREE.Box3().setFromObject(logo3D);
    const size = box.getSize(new THREE.Vector3());
    const currentWorldWidth = Math.max(size.x, 0.0001);

    const currentScale = logo3D.scale.x || 1;
    const scaleFactor = (targetWorldWidth / currentWorldWidth) || 1;
    let targetScale = currentScale * scaleFactor;

    // --- AJUSTE ADICIONAL: calcular factor para que la altura proyectada en píxeles coincida con el PNG ---
    // puntos top y bottom del bounding box en coordenadas mundo
    const worldTop = new THREE.Vector3(box.min.x, box.max.y, box.min.z);
    const worldBottom = new THREE.Vector3(box.min.x, box.min.y, box.min.z);

    // función que proyecta un punto mundo a coordenada pixel sobre el canvas
    function worldToPixel(v) {
        const vec = v.clone().project(camera);
        const x = (vec.x + 1) / 2 * renderer.domElement.clientWidth;
        const y = (1 - vec.y) / 2 * renderer.domElement.clientHeight;
        return { x, y };
    }

    // calcular altura actual en píxeles con la escala tentativa 'targetScale'
    // para eso clonamos el logo3D y aplicamos la escala temporalmente (sin influir DOM)
    const tempScale = targetScale;
    // crear transformados del top/bottom aplicando la escala relativa al centro del objeto
    const center = box.getCenter(new THREE.Vector3());
    // calcular puntos relativos al centro, aplicar escala y transformar de vuelta a world
    const relTop = worldTop.clone().sub(center).multiplyScalar(tempScale / currentScale).add(center);
    const relBottom = worldBottom.clone().sub(center).multiplyScalar(tempScale / currentScale).add(center);

    const pixTop = worldToPixel(relTop);
    const pixBottom = worldToPixel(relBottom);
    const currentPixelHeight = Math.max(1, Math.abs(pixTop.y - pixBottom.y));

    // factor requerido para que la altura en pantalla sea igual al PNG
    const pixelScaleFactor = targetPixelHeight / currentPixelHeight;

    // limitar (clamp) el factor para evitar escalados extremos
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let clampedFactor = isMobile
        ? Math.max(0.85, Math.min(pixelScaleFactor, 7.8))  // móviles
        : Math.max(0.6, Math.min(pixelScaleFactor, 5.6));  // escritorio


    // aplicar este ajuste al targetScale final
    targetScale = targetScale * clampedFactor;

    // rotación objetivo (plana, frontal)
    const targetRotation = new THREE.Euler(0, 0, 0);

    // valores iniciales
    const startPos = logo3D.position.clone();
    const startScale = logo3D.scale.x;
    const startRot = logo3D.rotation.clone();

    const startTime = performance.now();

    function animateToTarget(now) {
        const elapsed = now - startTime;
        const tRaw = Math.min(elapsed / durationMs, 1);
        const t = tRaw * tRaw * (3 - 2 * tRaw);

        // Interpolar posición
        logo3D.position.lerpVectors(startPos, targetPos, t);

        // Interpolar escala (uniforme) hacia 'targetScale'
        const currentS = startScale + (targetScale - startScale) * t;
        logo3D.scale.setScalar(currentS);

        // Interpolar rotación por componentes
        logo3D.rotation.x = lerp(startRot.x, targetRotation.x, t);
        logo3D.rotation.y = lerp(startRot.y, targetRotation.y, t);
        logo3D.rotation.z = lerp(startRot.z, targetRotation.z, t);

        renderer.render(scene, camera);

        if (t < 1) {
            requestAnimationFrame(animateToTarget);
        } else {
            // pequeña pausa y luego finalizar loader
            setTimeout(() => {
                animationComplete = true;
                finishLoader();
            }, 240);
        }
    }

    requestAnimationFrame(animateToTarget);
}


// ----------------- finishLoader, fallback, easing helpers -----------------

function finishLoader() {
    const loader3D = document.getElementById('loader3D');

    setTimeout(() => {
        if (loader3D) loader3D.classList.add('fade-out');

        setTimeout(() => {
            // Iniciar animación de la página principal (tu función existente)
            if (typeof startMainPageAnimation === 'function') startMainPageAnimation();

            // Limpiar recursos 3D
            setTimeout(() => {
                if (renderer) {
                    try {
                        renderer.dispose();
                    } catch (e) { console.warn(e); }
                }
                if (loader3D) loader3D.remove();
            }, 1000);
        }, 300);
    }, 200);
}

function fallbackToMainPage() {
    const loader3D = document.getElementById('loader3D');
    if (loader3D) loader3D.classList.add('fade-out');
    setTimeout(() => {
        if (typeof startMainPageAnimation === 'function') startMainPageAnimation();
        if (loader3D) loader3D.remove();
    }, 800);
}

// EASING (no cambié estas, están como antes)
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInCubic(t) { return t * t * t; }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function lerp(start, end, t) { return start + (end - start) * t; }

// Iniciar
window.addEventListener('DOMContentLoaded', init3DLoader);

