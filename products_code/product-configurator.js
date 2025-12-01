/* =====================================================
   CONFIGURADOR UNIVERSAL DE PRODUCTOS NFC
   Sistema inteligente basado en data attributes
   ===================================================== */

class ProductConfigurator {
    constructor() {
        this.productData = this.extractProductData();
        this.selectedOptions = new Map();
        this.init();
    }

    init() {
        const configButton = document.querySelector('.configure-button');
        
        if (configButton) {
            configButton.addEventListener('click', () => this.openModal());
        }
    }

    // Extraer datos del producto desde el HTML
    extractProductData() {
        return {
            name: document.querySelector('.product-name')?.textContent || 'Producto NFC',
            category: document.querySelector('.product-category')?.textContent || 'PREMIUM',
            price: document.querySelector('.product-price')?.textContent || '$PRECIO',
            description: document.querySelector('.product-description')?.textContent || '',
            // Extraer opciones de configuración desde los config-groups
            configGroups: this.extractConfigGroups()
        };
    }

    // Extraer grupos de configuración del HTML
    extractConfigGroups() {
        const groups = [];
        const configGroups = document.querySelectorAll('.config-group');
        
        configGroups.forEach((group, index) => {
            const title = group.querySelector('.group-header span')?.textContent;
            const options = [];
            
            group.querySelectorAll('.group-list li').forEach(li => {
                const text = li.textContent.trim();
                if (text && !text.includes('Si deseas conocer')) {
                    options.push(text.replace('• ', ''));
                }
            });

            if (title && options.length > 0) {
                groups.push({
                    id: `group-${index}`,
                    title: title,
                    options: options,
                    selected: []
                });
            }
        });

        return groups;
    }

    // Abrir modal de configuración
    openModal() {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'config-modal-overlay';
        overlay.innerHTML = this.generateModalHTML();
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Event listeners
        this.attachModalEvents(overlay);

        // Animación de entrada
        setTimeout(() => overlay.classList.add('active'), 10);
    }

    // Generar HTML del modal
    generateModalHTML() {
        return `
            <div class="config-modal">
                <!-- Header -->
                <div class="config-modal-header">
                    <h2>Configurar: ${this.productData.name}</h2>
                    <button class="modal-close" aria-label="Cerrar">×</button>
                </div>

                <!-- Body -->
                <div class="config-modal-body">
                    <!-- Info del producto -->
                    <div class="config-product-info">
                        <span class="config-category">${this.productData.category}</span>
                        <p class="config-price">${this.productData.price} MXN</p>
                    </div>

                    <!-- Instrucciones -->
                    <div class="config-instructions">
                        <h3> ¿Cómo quieres configurar tu NFC?</h3>
                        <p>Selecciona una o más opciones de configuración que necesites:</p>
                    </div>

                    <!-- Grupos de configuración -->
                    <div class="config-groups-container">
                        ${this.generateGroupsHTML()}
                    </div>

                    <!-- Sección de contacto -->
                    <div class="config-contact">
                        <h3>📱 Tus Datos de Contacto</h3>
                        
                        <div class="form-group">
                            <label for="config-nombre">Nombre completo *</label>
                            <input type="text" id="config-nombre" required placeholder="Juan Pérez">
                        </div>

                        <div class="form-group">
                            <label for="config-telefono">WhatsApp *</label>
                            <div class="telefono-wrapper">
                                <span class="telefono-prefix">+52</span>
                                <input type="tel" id="config-telefono" required placeholder="722 123 4567" pattern="[0-9]{10}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="config-notas">Notas adicionales (opcional)</label>
                            <textarea id="config-notas" rows="3" placeholder="¿Algo específico que debamos saber?"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="config-modal-footer">
                    <button class="btn-cancel">Cancelar</button>
                    <button class="btn-send-whatsapp">
                        <span>Enviar a WhatsApp</span>
                        <span></span>
                    </button>
                </div>
            </div>
        `;
    }

    // Generar HTML de grupos de configuración
    generateGroupsHTML() {
        if (this.productData.configGroups.length === 0) {
            return '<p class="no-config">Este producto usa configuración estándar.</p>';
        }

        return this.productData.configGroups.map(group => `
            <div class="config-group-item" data-group-id="${group.id}">
                <h4 class="group-title">
                    <span class="group-icon">⚙️</span>
                    ${group.title}
                </h4>
                <div class="group-options">
                    ${group.options.slice(0, 8).map((option, index) => `
                        <label class="config-option-label">
                            <input 
                                type="checkbox" 
                                name="${group.id}" 
                                value="${option}"
                                data-group="${group.id}"
                            >
                            <span>${option}</span>
                        </label>
                    `).join('')}
                    ${group.options.length > 8 ? `
                        <button class="show-more-btn" data-group="${group.id}">
                            Ver más opciones (${group.options.length - 8})
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Agregar event listeners al modal
    attachModalEvents(overlay) {
        const modal = overlay.querySelector('.config-modal');
        const closeBtn = overlay.querySelector('.modal-close');
        const cancelBtn = overlay.querySelector('.btn-cancel');
        const sendBtn = overlay.querySelector('.btn-send-whatsapp');

        // Cerrar modal
        const closeModal = () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Cerrar al hacer click fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Cerrar con ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Enviar a WhatsApp
        sendBtn.addEventListener('click', () => this.sendToWhatsApp(overlay));

        // Checkboxes
        const checkboxes = overlay.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                const groupId = e.target.dataset.group;
                const value = e.target.value;
                
                if (!this.selectedOptions.has(groupId)) {
                    this.selectedOptions.set(groupId, []);
                }

                const groupOptions = this.selectedOptions.get(groupId);
                
                if (e.target.checked) {
                    groupOptions.push(value);
                } else {
                    const index = groupOptions.indexOf(value);
                    if (index > -1) groupOptions.splice(index, 1);
                }

                this.updateSelectionCount(overlay);
            });
        });

        // Botones "Ver más"
        const showMoreBtns = overlay.querySelectorAll('.show-more-btn');
        showMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupId = e.target.dataset.group;
                this.showAllOptions(groupId, overlay);
            });
        });
    }

    // Mostrar todas las opciones de un grupo
    showAllOptions(groupId, overlay) {
        const group = this.productData.configGroups.find(g => g.id === groupId);
        if (!group) return;

        const groupElement = overlay.querySelector(`[data-group-id="${groupId}"]`);
        const optionsContainer = groupElement.querySelector('.group-options');
        
        // Regenerar con todas las opciones
        optionsContainer.innerHTML = group.options.map(option => `
            <label class="config-option-label">
                <input 
                    type="checkbox" 
                    name="${group.id}" 
                    value="${option}"
                    data-group="${group.id}"
                    ${this.selectedOptions.get(groupId)?.includes(option) ? 'checked' : ''}
                >
                <span>${option}</span>
            </label>
        `).join('');

        // Re-agregar event listeners
        optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const value = e.target.value;
                const groupOptions = this.selectedOptions.get(groupId) || [];
                
                if (e.target.checked) {
                    groupOptions.push(value);
                } else {
                    const index = groupOptions.indexOf(value);
                    if (index > -1) groupOptions.splice(index, 1);
                }
                
                this.selectedOptions.set(groupId, groupOptions);
                this.updateSelectionCount(overlay);
            });
        });
    }

    // Actualizar contador de selecciones
    updateSelectionCount(overlay) {
        let total = 0;
        this.selectedOptions.forEach(options => {
            total += options.length;
        });

        const sendBtn = overlay.querySelector('.btn-send-whatsapp');
        const countSpan = sendBtn.querySelector('.selection-count');
        
        if (total > 0) {
            if (!countSpan) {
                const count = document.createElement('span');
                count.className = 'selection-count';
                count.textContent = `(${total})`;
                sendBtn.insertBefore(count, sendBtn.querySelector('span:last-child'));
            } else {
                countSpan.textContent = `(${total})`;
            }
        } else if (countSpan) {
            countSpan.remove();
        }
    }

    // Enviar configuración a WhatsApp
    sendToWhatsApp(overlay) {
        // Validar datos de contacto
        const nombre = document.getElementById('config-nombre').value.trim();
        const telefono = document.getElementById('config-telefono').value.trim();
        const notas = document.getElementById('config-notas').value.trim();

        if (!nombre || nombre.length < 3) {
            this.showError('Por favor ingresa tu nombre completo');
            return;
        }

        if (!telefono || !/^[0-9]{10}$/.test(telefono)) {
            this.showError('Por favor ingresa un número de WhatsApp válido (10 dígitos)');
            return;
        }

        // Validar que haya al menos una opción seleccionada
        let hasSelection = false;
        this.selectedOptions.forEach(options => {
            if (options.length > 0) hasSelection = true;
        });

        if (!hasSelection) {
            this.showError('Por favor selecciona al menos una opción de configuración');
            return;
        }

        // Generar mensaje
        const mensaje = this.generateWhatsAppMessage(nombre, telefono, notas);

        // Abrir WhatsApp
        const numeroWhatsApp = '5217225368687'; // Tu número
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        
        window.open(url, '_blank');

        // Cerrar modal y mostrar éxito
        this.showSuccess('¡Redirigiendo a WhatsApp!');
        
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        }, 1500);
    }

    // Generar mensaje para WhatsApp
    generateWhatsAppMessage(nombre, telefono, notas) {
        let mensaje = `* NUEVA CONFIGURACIÓN DE PRODUCTO*\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        // Info del producto
        mensaje += `* PRODUCTO*\n`;
        mensaje += `• ${this.productData.name}\n`;
        mensaje += `• ${this.productData.category}\n`;
        mensaje += `• Precio: ${this.productData.price} MXN\n\n`;

        // Configuraciones seleccionadas
        mensaje += `* CONFIGURACIÓN SOLICITADA*\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;

        this.selectedOptions.forEach((options, groupId) => {
            if (options.length > 0) {
                const group = this.productData.configGroups.find(g => g.id === groupId);
                if (group) {
                    mensaje += `*${group.title}:*\n`;
                    options.forEach(option => {
                        mensaje += `  ✓ ${option}\n`;
                    });
                    mensaje += `\n`;
                }
            }
        });

        // Datos de contacto
        mensaje += `* DATOS DEL CLIENTE*\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `• Nombre: ${nombre}\n`;
        mensaje += `• WhatsApp: +52 ${telefono}\n`;
        
        if (notas) {
            mensaje += `\n* NOTAS ADICIONALES*\n`;
            mensaje += `${notas}\n`;
        }

        mensaje += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += ` ${this.getCurrentDateTime()}\n`;
        mensaje += `\n_Enviado desde themidastuch.com_`;

        return mensaje;
    }

    // Obtener fecha y hora actual
    getCurrentDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return now.toLocaleDateString('es-MX', options);
    }

    // Mostrar mensaje de error
    showError(mensaje) {
        const existing = document.querySelector('.config-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'config-toast error';
        toast.innerHTML = `
            <span class="toast-icon">⚠️</span>
            <span class="toast-message">${mensaje}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Mostrar mensaje de éxito
    showSuccess(mensaje) {
        const existing = document.querySelector('.config-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'config-toast success';
        toast.innerHTML = `
            <span class="toast-icon">✅</span>
            <span class="toast-message">${mensaje}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProductConfigurator();
    });
} else {
    new ProductConfigurator();
}