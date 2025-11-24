/* =====================================================
   PRODUCT PAGE - FUNCTIONALITY
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== SMOOTH SCROLL PARA NAVEGACIÓN =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== TABS STICKY - HIGHLIGHT ON SCROLL =====
    const tabs = document.querySelector('.category-tabs');
    const productHeader = document.querySelector('.product-header');
    
    if (tabs && productHeader) {
        window.addEventListener('scroll', () => {
            const headerHeight = productHeader.offsetHeight;
            
            if (window.scrollY > headerHeight) {
                tabs.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
            } else {
                tabs.style.boxShadow = 'none';
            }
        });
    }

    // ===== SCROLL HORIZONTAL EN GALERÍA =====
    const gallery = document.querySelector('.related-gallery');
    
    if (gallery) {
        let isDown = false;
        let startX;
        let scrollLeft;

        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            gallery.style.cursor = 'grabbing';
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('mouseleave', () => {
            isDown = false;
            gallery.style.cursor = 'grab';
        });

        gallery.addEventListener('mouseup', () => {
            isDown = false;
            gallery.style.cursor = 'grab';
        });

        gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 2;
            gallery.scrollLeft = scrollLeft - walk;
        });
    }

    // ===== OPCIONES DE CONFIGURACIÓN - SELECCIÓN =====
    const configOptions = document.querySelectorAll('.config-option');
    
    configOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección previa del grupo
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            
            // Visual feedback
            configOptions.forEach(opt => {
                opt.style.background = 'rgba(0, 0, 0, 0.3)';
            });
            
            this.style.background = 'rgba(212, 175, 55, 0.1)';
        });
    });

    // ===== BOTÓN CONFIGURAR - PLACEHOLDER FUNCTIONALITY =====
    const configureBtn = document.querySelector('.configure-button');
    
    if (configureBtn) {
        configureBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Aquí puedes agregar funcionalidad futura
            // Por ahora solo un alert de ejemplo
            const selectedOption = document.querySelector('.config-option input[type="radio"]:checked');
            
            if (selectedOption) {
                const optionName = selectedOption.nextElementSibling.textContent;
                console.log('Configuración seleccionada:', optionName);
                // alert('Configuración: ' + optionName);
            } else {
                console.log('No hay configuración seleccionada');
                // alert('Por favor selecciona una opción de configuración');
            }
        });
    }

    // ===== ANIMACIÓN DE ENTRADA =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos para animación
    document.querySelectorAll('.details-box, .related-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

/* =====================================================
   3D MODEL VIEWER FOR PRODUCT PAGE
   ===================================================== */

class ProductModelViewer {
    constructor(container, modelPath) {
        this.container = container;
        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = null;
        
        this.init();
    }
    
    init() {
        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = null;
        
        // Configurar cámara
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 2000);
        this.camera.position.z = 5;
        
        // Configurar renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.container.appendChild(this.renderer.domElement);
        
        // Iluminación
        this.setupLighting();
        
        // Cargar modelo
        this.loadModel();
        
        // Controles de órbita (si está disponible)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;
            this.controls.autoRotate = false;
        }
        
        // Responsive
        window.addEventListener('resize', () => this.onResize());
        
        // Render loop
        this.animate();
    }
    
    setupLighting() {
        // Luz ambiental
        const ambient = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambient);

        // Luz principal
        const key = new THREE.DirectionalLight(0xffffff, 1.4);
        key.position.set(5, 5, 7);
        this.scene.add(key);

        // Luz de relleno
        const fill = new THREE.DirectionalLight(0xffffff, 0.6);
        fill.position.set(-5, 2, 4);
        this.scene.add(fill);

        // Luz dorada
        const gold = new THREE.PointLight(0xFFD700, 1.6, 15);
        gold.position.set(0, 1, 3);
        this.scene.add(gold);

        // Luz trasera
        const rim = new THREE.DirectionalLight(0xffffff, 0.8);
        rim.position.set(0, 6, -6);
        this.scene.add(rim);
    }
    
    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            this.modelPath,
            (gltf) => {
                this.model = gltf.scene;
                
                // Calcular bounding box y centrar
                const box = new THREE.Box3().setFromObject(this.model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                // Escalar el modelo
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim;
                this.model.scale.setScalar(scale);
                
                // Centrar el modelo
                box.setFromObject(this.model);
                box.getCenter(center);
                this.model.position.sub(center);
                
                // Posicionar cámara
                this.camera.position.set(0, 0, 4);
                this.camera.lookAt(0, 0, 0);
                
                // Agregar a la escena
                this.scene.add(this.model);
                
                console.log('Modelo 3D cargado:', this.modelPath);
            },
            (xhr) => {
                const percent = (xhr.loaded / xhr.total) * 100;
                console.log(`Cargando modelo: ${percent.toFixed(0)}%`);
            },
            (error) => {
                console.error('Error al cargar modelo 3D:', error);
            }
        );
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotación suave del modelo
        if (this.model) {
            this.model.rotation.y += 0.003;
        }
        
        // Actualizar controles
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Inicializar modelo 3D cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const viewer3D = document.querySelector('.product-3d-viewer');
    const modelPath = viewer3D ? viewer3D.getAttribute('data-model') : null;
    
    if (viewer3D && modelPath) {
        new ProductModelViewer(viewer3D, modelPath);
    }
});