/* =====================================================
   VISOR 3D ESTÁTICO PARA PRODUCTOS
   Muestra modelos .glb sin animaciones
   ===================================================== */

class Product3DViewer {
    constructor(container, modelPath) {
        this.container = container;
        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        
        this.init();
    }
    
    init() {
        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparente
        
        // Configurar cámara
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 2000);
        this.camera.position.z = 5;
        
        // Configurar renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true // Fondo transparente
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Agregar canvas al contenedor
        this.container.appendChild(this.renderer.domElement);
        
        // Iluminación dorada (igual que el loader)
        this.setupLighting();
        
        // Cargar modelo
        this.loadModel();
        
        // Responsive
        window.addEventListener('resize', () => this.onResize());
        
        // Render loop
        this.animate();
    }
    
    setupLighting() {
    // Luz ambiental más blanca y fuerte (suaviza sombras)
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    // Luz principal frontal (ilumina el modelo blanco y el logo dorado)
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 5, 7);
    this.scene.add(key);

    // Luz de relleno lateral suave
    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.set(-5, 2, 4);
    this.scene.add(fill);

    // Luz cálida que refuerza el dorado
    const gold = new THREE.PointLight(0xFFD700, 1.6, 15); 
    gold.position.set(0, 1, 3);
    this.scene.add(gold);

    // Luz trasera para darle borde al modelo
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
                
                // Escalar el modelo para que quepa bien
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim; // Ajusta este valor si quieres más grande/pequeño
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
        
        // Rotación suave y lenta del modelo (opcional)
        if (this.model) {
            this.model.rotation.y += 0.003; // Velocidad de rotación (ajústalo o ponlo en 0 para estático)
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
    
    // Método para limpiar recursos
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

/* =====================================================
   INICIALIZACIÓN DE MODELOS 3D EN PRODUCTOS
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Array para guardar las instancias de los viewers
    const viewers = [];
    
    // Buscar todos los productos que tienen el atributo data-3d-model
    const productos3D = document.querySelectorAll('.producto-item[data-3d-model]');
    
    productos3D.forEach(productoItem => {
        const modelPath = productoItem.getAttribute('data-3d-model');
        
        if (!modelPath) return;
        
        // Ocultar la imagen si existe
        const img = productoItem.querySelector('img');
        if (img) {
            img.style.display = 'none';
        }
        
        // Crear contenedor para el canvas 3D
        const canvas3DContainer = document.createElement('div');
        canvas3DContainer.className = 'producto-3d-canvas';
        canvas3DContainer.style.width = '100%';
        canvas3DContainer.style.height = '100%';
        canvas3DContainer.style.position = 'relative';
        
        productoItem.appendChild(canvas3DContainer);
        
        // Crear instancia del viewer 3D
        const viewer = new Product3DViewer(canvas3DContainer, modelPath);
        viewers.push(viewer);
    });
    
    // Limpiar recursos cuando se cierre la página
    window.addEventListener('beforeunload', () => {
        viewers.forEach(viewer => viewer.dispose());
    });
});