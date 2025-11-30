/* =====================================================
   LAZY LOADING PARA MODELOS 3D
   Solo carga modelos cuando están visibles
   ===================================================== */

class Lazy3DLoader {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Buscar todos los contenedores de modelos 3D
    const containers = document.querySelectorAll('[data-3d-model], .product-3d-viewer[data-model]');
    
    containers.forEach(container => {
      this.observeContainer(container);
    });
  }

  observeContainer(container) {
    const options = {
      root: null,
      rootMargin: '200px', // Cargar 200px antes de ser visible
      threshold: 0.01
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadModel(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(container);
    this.observers.set(container, observer);
  }

  loadModel(container) {
    const modelPath = container.getAttribute('data-3d-model') || container.getAttribute('data-model');
    
    if (!modelPath) return;

    // Mostrar placeholder mientras carga
    this.showPlaceholder(container);

    // Verificar si es producto individual o carrusel
    if (container.classList.contains('product-3d-viewer')) {
      this.loadProductViewer(container, modelPath);
    } else {
      this.loadCarouselModel(container, modelPath);
    }
  }

  showPlaceholder(container) {
    if (container.querySelector('.loading-placeholder')) return;

    const placeholder = document.createElement('div');
    placeholder.className = 'loading-placeholder';
    placeholder.innerHTML = `
      <div class="spinner"></div>
      <p>Cargando modelo 3D...</p>
    `;
    
    placeholder.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: var(--gold);
      font-family: 'Inter', sans-serif;
      z-index: 10;
    `;

    const spinner = placeholder.querySelector('.spinner');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid rgba(212, 175, 55, 0.2);
      border-top-color: var(--gold);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    `;

    container.appendChild(placeholder);

    // Agregar animación
    if (!document.querySelector('#spinner-animation')) {
      const style = document.createElement('style');
      style.id = 'spinner-animation';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  removePlaceholder(container) {
    const placeholder = container.querySelector('.loading-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
  }

  loadProductViewer(container, modelPath) {
    // Importar Product3DViewer si existe
    if (typeof Product3DViewer !== 'undefined') {
      try {
        new Product3DViewer(container, modelPath);
        this.removePlaceholder(container);
      } catch (error) {
        console.error('Error cargando modelo:', error);
        this.showError(container);
      }
    }
  }

  loadCarouselModel(container, modelPath) {
    // Para modelos del carrusel
    const img = container.querySelector('img');
    if (img) {
      img.style.display = 'none';
    }

    const canvas3DContainer = document.createElement('div');
    canvas3DContainer.className = 'producto-3d-canvas';
    canvas3DContainer.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
    `;

    container.appendChild(canvas3DContainer);

    if (typeof Product3DViewer !== 'undefined') {
      try {
        new Product3DViewer(canvas3DContainer, modelPath);
        this.removePlaceholder(container);
      } catch (error) {
        console.error('Error cargando modelo del carrusel:', error);
        this.showError(container);
      }
    }
  }

  showError(container) {
    this.removePlaceholder(container);
    
    const error = document.createElement('div');
    error.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: rgba(255, 100, 100, 0.8);
      font-family: 'Inter', sans-serif;
    `;
    error.textContent = '⚠️ Error al cargar modelo';
    container.appendChild(error);
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Lazy3DLoader();
  });
} else {
  new Lazy3DLoader();
}