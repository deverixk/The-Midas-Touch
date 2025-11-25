/* =====================================================
   FORMULARIO CONTACTO - FUNCIONALIDAD JAVASCRIPT
   ===================================================== */

// Variables globales
let formularioData = {
    motivo: '',
    motivoTipo: '',
    productos: [],
    cantidad: '',
    programacion: [],
    otroProgramacion: '',
    tipoSoporte: '',
    problemaDetalle: '',
    tipoInfo: '',
    preguntaDetalle: '',
    tipoEmpresa: '',
    cantidadEmpresa: '',
    proyectoDetalle: '',
    nombre: '',
    telefono: '',
    email: '',
    detallesExtra: ''
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarFormulario();
});

function inicializarFormulario() {
    // PASO 1: Botones de motivo (solo dentro del formulario de contacto)
    const motivoBtns = document.querySelectorAll('#contactForm .motivo-btn');
    motivoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            seleccionarMotivo(this);
        });
    });

    // PASO 2: Botones de soporte/info/empresa
    const soporteBtns = document.querySelectorAll('.soporte-btn');
    soporteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            seleccionarOpcion(this, 'soporte');
        });
    });

    const infoBtns = document.querySelectorAll('.info-btn');
    infoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            seleccionarOpcion(this, 'info');
        });
    });

    const empresaBtns = document.querySelectorAll('.empresa-btn');
    empresaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            seleccionarOpcion(this, 'empresa');
        });
    });

    // Checkboxes de programación - mostrar campo "Otro"
    const programacionCheckboxes = document.querySelectorAll('input[name="programacion[]"]');
    programacionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const otroProgramacionGroup = document.getElementById('otroProgramacionGroup');
            const otroCheckbox = document.querySelector('input[name="programacion[]"][value="Otro"]');
            
            if (otroCheckbox && otroCheckbox.checked) {
                otroProgramacionGroup.style.display = 'block';
            } else {
                otroProgramacionGroup.style.display = 'none';
            }
        });
    });

    // Contador de caracteres para detalles extra
    const detallesExtra = document.getElementById('detallesExtra');
    if (detallesExtra) {
        detallesExtra.addEventListener('input', function() {
            const contador = document.querySelector('.form-counter');
            const caracteresActuales = this.value.length;
            contador.textContent = `${caracteresActuales}/300 caracteres`;
            
            if (caracteresActuales >= 300) {
                contador.style.color = 'var(--gold)';
            } else {
                contador.style.color = 'rgba(250, 250, 250, 0.5)';
            }
        });
    }

    // Botones "Volver"
    const btnVolver = document.querySelectorAll('.btn-volver');
    btnVolver.forEach(btn => {
        btn.addEventListener('click', function() {
            const pasoDestino = this.getAttribute('data-volver');
            irAPaso(pasoDestino);
        });
    });

    // Botones "Siguiente"
    const btnSiguiente = document.querySelectorAll('.btn-siguiente');
    btnSiguiente.forEach(btn => {
        btn.addEventListener('click', function() {
            const pasoActual = this.closest('.form-step');
            if (validarPasoActual(pasoActual)) {
                const pasoDestino = this.getAttribute('data-siguiente');
                irAPaso(pasoDestino);
            }
        });
    });

    // Submit del formulario
    const formulario = document.getElementById('contactForm');
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        enviarFormulario();
    });
}

// Seleccionar motivo (Paso 1)
function seleccionarMotivo(btn) {
    // Remover selección previa
    document.querySelectorAll('.motivo-btn').forEach(b => b.classList.remove('selected'));
    
    // Seleccionar el botón actual
    btn.classList.add('selected');
    
    // Guardar motivo seleccionado
    const motivo = btn.getAttribute('data-motivo');
    formularioData.motivo = motivo;
    
    // Ir al paso 2 correspondiente después de una pequeña pausa (efecto visual)
    setTimeout(() => {
        mostrarPaso2(motivo);
    }, 300);
}

// Mostrar el Paso 2 correspondiente
function mostrarPaso2(motivo) {
    // Ocultar el paso 1 DEL FORMULARIO
    const paso1 = document.querySelector('#contactForm .form-step[data-step="1"]');
    paso1.classList.remove('active');
    
    // Mostrar el paso 2 correspondiente DEL FORMULARIO
    const paso2 = document.querySelector(`#contactForm .form-step[data-step="2"][data-motivo-tipo="${motivo}"]`);
    if (paso2) {
        paso2.classList.add('active');
        
        // Scroll suave al contenedor del formulario
        setTimeout(() => {
            const formularioWrapper = document.querySelector('.contacto-formulario-wrapper');
            if (formularioWrapper) {
                const offset = 100; // Espacio desde arriba
                const elementPosition = formularioWrapper.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// Seleccionar opción (Soporte/Info/Empresa)
function seleccionarOpcion(btn, tipo) {
    // Remover selección previa
    const contenedor = btn.parentElement;
    contenedor.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    
    // Seleccionar el botón actual
    btn.classList.add('selected');
    
    // Guardar opción seleccionada
    const valor = btn.getAttribute(`data-${tipo}`);
    
    if (tipo === 'soporte') {
        formularioData.tipoSoporte = valor;
    } else if (tipo === 'info') {
        formularioData.tipoInfo = valor;
    } else if (tipo === 'empresa') {
        formularioData.tipoEmpresa = valor;
    }
}

// Validar paso actual antes de continuar
function validarPasoActual(paso) {
    const motivoTipo = paso.getAttribute('data-motivo-tipo');
    
    if (motivoTipo === 'cotizar') {
        // Validar que al menos un producto esté seleccionado
        const productosSeleccionados = document.querySelectorAll('input[name="productos[]"]:checked');
        if (productosSeleccionados.length === 0) {
            mostrarError('Por favor, selecciona al menos un producto');
            return false;
        }
        
        // Validar cantidad
        const cantidad = document.getElementById('cantidad').value;
        if (!cantidad) {
            mostrarError('Por favor, selecciona la cantidad de unidades');
            return false;
        }
        
        // Validar programación
        const programacionSeleccionada = document.querySelectorAll('input[name="programacion[]"]:checked');
        if (programacionSeleccionada.length === 0) {
            mostrarError('Por favor, selecciona al menos una opción de programación');
            return false;
        }
        
        // Si seleccionó "Otro" en programación, validar que especifique
        const otroCheckbox = document.querySelector('input[name="programacion[]"][value="Otro"]');
        if (otroCheckbox && otroCheckbox.checked) {
            const otroProgramacion = document.getElementById('otroProgramacion').value.trim();
            if (!otroProgramacion) {
                mostrarError('Por favor, especifica qué necesitas programar');
                return false;
            }
        }
        
    } else if (motivoTipo === 'soporte') {
        // Validar tipo de soporte
        if (!formularioData.tipoSoporte) {
            mostrarError('Por favor, selecciona el tipo de soporte que necesitas');
            return false;
        }
        
        // Validar descripción del problema
        const problemaDetalle = document.getElementById('problemaDetalle').value.trim();
        if (!problemaDetalle || problemaDetalle.length < 10) {
            mostrarError('Por favor, describe tu problema con más detalle (mínimo 10 caracteres)');
            return false;
        }
        
    } else if (motivoTipo === 'info') {
        // Validar tipo de info
        if (!formularioData.tipoInfo) {
            mostrarError('Por favor, selecciona sobre qué quieres saber más');
            return false;
        }
        
        // Validar pregunta específica
        const preguntaDetalle = document.getElementById('preguntaDetalle').value.trim();
        if (!preguntaDetalle || preguntaDetalle.length < 10) {
            mostrarError('Por favor, escribe tu pregunta con más detalle (mínimo 10 caracteres)');
            return false;
        }
        
    } else if (motivoTipo === 'empresa') {
        // Validar tipo de empresa
        if (!formularioData.tipoEmpresa) {
            mostrarError('Por favor, selecciona el tipo de paquete empresarial');
            return false;
        }
        
        // Validar cantidad empresa
        const cantidadEmpresa = document.getElementById('cantidadEmpresa').value;
        if (!cantidadEmpresa) {
            mostrarError('Por favor, selecciona el tamaño del pedido');
            return false;
        }
        
        // Validar detalles del proyecto
        const proyectoDetalle = document.getElementById('proyectoDetalle').value.trim();
        if (!proyectoDetalle || proyectoDetalle.length < 20) {
            mostrarError('Por favor, describe tu proyecto con más detalle (mínimo 20 caracteres)');
            return false;
        }
    }
    
    return true;
}

// Validar Paso 3 (Datos de contacto)
function validarPaso3() {
    // Validar nombre
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre || nombre.length < 3) {
        mostrarError('Por favor, ingresa tu nombre completo (mínimo 3 caracteres)');
        return false;
    }
    
    // Validar teléfono (10 dígitos)
    const telefono = document.getElementById('telefono').value.trim();
    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefonoRegex.test(telefono)) {
        mostrarError('Por favor, ingresa un número de teléfono válido de 10 dígitos');
        return false;
    }
    
    // Validar email si está presente
    const email = document.getElementById('email').value.trim();
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarError('Por favor, ingresa un email válido');
            return false;
        }
    }
    
    // Validar checkboxes
    const aceptoWhatsapp = document.querySelector('input[name="aceptoWhatsapp"]').checked;
    const aceptoTerminos = document.querySelector('input[name="aceptoTerminos"]').checked;
    
    if (!aceptoWhatsapp) {
        mostrarError('Debes aceptar ser contactado vía WhatsApp');
        return false;
    }
    
    if (!aceptoTerminos) {
        mostrarError('Debes aceptar la política de privacidad');
        return false;
    }
    
    return true;
}

// Ir a un paso específico del formulario
function irAPaso(numeroPaso) {
    // Ocultar todos los pasos DEL FORMULARIO únicamente
    const todosLosPasos = document.querySelectorAll('#contactForm .form-step');
    todosLosPasos.forEach(paso => paso.classList.remove('active'));
    
    // Si vuelve al paso 1, mostrar solo ese
    if (numeroPaso === '1') {
        const paso1 = document.querySelector('#contactForm .form-step[data-step="1"]');
        paso1.classList.add('active');
        
        // Scroll al contenedor del formulario
        setTimeout(() => {
            const formularioWrapper = document.querySelector('.contacto-formulario-wrapper');
            if (formularioWrapper) {
                const offset = 100; // Espacio desde arriba
                const elementPosition = formularioWrapper.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        }, 100);
        return;
    }
    
    // Si va al paso 2, mostrar el que corresponda según el motivo
    if (numeroPaso === '2') {
        const paso2 = document.querySelector(`#contactForm .form-step[data-step="2"][data-motivo-tipo="${formularioData.motivo}"]`);
        if (paso2) {
            paso2.classList.add('active');
            
            // Scroll al contenedor del formulario
            setTimeout(() => {
                const formularioWrapper = document.querySelector('.contacto-formulario-wrapper');
                if (formularioWrapper) {
                    const offset = 100;
                    const elementPosition = formularioWrapper.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
        return;
    }
    
    // Si va al paso 3
    if (numeroPaso === '3') {
        const paso3 = document.querySelector('#contactForm .form-step[data-step="3"]');
        paso3.classList.add('active');
        
        // Scroll al contenedor del formulario
        setTimeout(() => {
            const formularioWrapper = document.querySelector('.contacto-formulario-wrapper');
            if (formularioWrapper) {
                const offset = 100;
                const elementPosition = formularioWrapper.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        }, 100);
        return;
    }
}

// Recopilar todos los datos del formulario
function recopilarDatos() {
    // Datos de contacto
    formularioData.nombre = document.getElementById('nombre').value.trim();
    formularioData.telefono = document.getElementById('telefono').value.trim();
    formularioData.email = document.getElementById('email').value.trim();
    formularioData.detallesExtra = document.getElementById('detallesExtra').value.trim();
    
    // Según el motivo, recopilar datos específicos
    if (formularioData.motivo === 'cotizar') {
        // Productos seleccionados
        const productosChecked = document.querySelectorAll('input[name="productos[]"]:checked');
        formularioData.productos = Array.from(productosChecked).map(cb => cb.value);
        
        // Cantidad
        formularioData.cantidad = document.getElementById('cantidad').value;
        
        // Programación seleccionada
        const programacionChecked = document.querySelectorAll('input[name="programacion[]"]:checked');
        formularioData.programacion = Array.from(programacionChecked).map(cb => cb.value);
        
        // Otro programación
        formularioData.otroProgramacion = document.getElementById('otroProgramacion').value.trim();
        
    } else if (formularioData.motivo === 'soporte') {
        formularioData.problemaDetalle = document.getElementById('problemaDetalle').value.trim();
        
    } else if (formularioData.motivo === 'info') {
        formularioData.preguntaDetalle = document.getElementById('preguntaDetalle').value.trim();
        
    } else if (formularioData.motivo === 'empresa') {
        formularioData.cantidadEmpresa = document.getElementById('cantidadEmpresa').value;
        formularioData.proyectoDetalle = document.getElementById('proyectoDetalle').value.trim();
    }
}

// Generar mensaje para WhatsApp
function generarMensajeWhatsApp() {
    let mensaje = `*NUEVA SOLICITUD - THE MIDAS TOUCH*
 ${obtenerFechaHora()}
━━━━━━━━━━━━━━━━━

 *CLIENTE*
*Nombre:* ${formularioData.nombre}
*Tel:* +52 ${formularioData.telefono}`;

    if (formularioData.email) {
        mensaje += `\n*Email:* ${formularioData.email}`;
    }

    mensaje += `\n\n *SOLICITUD*
\n`;

    // Según el motivo, agregar información específica
    if (formularioData.motivo === 'cotizar') {
        mensaje += `*Tipo:* COTIZACIÓN DE PRODUCTO\n\n`;
        mensaje += `*PRODUCTOS SELECCIONADOS:*\n`;
        formularioData.productos.forEach(prod => {
            mensaje += `- ${prod} ✓\n`;
        });
        mensaje += `\n *Cantidad:* ${formularioData.cantidad}\n\n`;
        mensaje += ` *PROGRAMACIÓN:*\n`;
        formularioData.programacion.forEach(prog => {
            mensaje += `- ${prog} ✓\n`;
        });
        if (formularioData.otroProgramacion) {
            mensaje += `\n*Detalle de "Otro":* ${formularioData.otroProgramacion}`;
        }
        
    } else if (formularioData.motivo === 'soporte') {
        mensaje += `*Tipo:* SOPORTE TÉCNICO\n\n`;
        mensaje += ` *Tipo de soporte:* ${formularioData.tipoSoporte}\n\n`;
        mensaje += ` *Problema:*\n${formularioData.problemaDetalle}`;
        
    } else if (formularioData.motivo === 'info') {
        mensaje += `*Tipo:* INFORMACIÓN GENERAL\n\n`;
        mensaje += ` *Tema:* ${formularioData.tipoInfo}\n\n`;
        mensaje += ` *Pregunta:*\n${formularioData.preguntaDetalle}`;
        
    } else if (formularioData.motivo === 'empresa') {
        mensaje += `*Tipo:* PAQUETES EMPRESAS\n\n`;
        mensaje += ` *Sector:* ${formularioData.tipoEmpresa}\n`;
        mensaje += ` *Cantidad:* ${formularioData.cantidadEmpresa}\n\n`;
        mensaje += ` *Detalles del proyecto:*\n${formularioData.proyectoDetalle}`;
    }

    if (formularioData.detallesExtra) {
        mensaje += `\n\n *DETALLES ADICIONALES*
━━━━━━━━━━━━━━━━━
${formularioData.detallesExtra}`;
    }

    mensaje += `\n\n━━━━━━━━━━━━━━━━━
 *Responder lo antes posible*
━━━━━━━━━━━━━━━━━`;

    return mensaje;
}

// Obtener fecha y hora actual formateada
function obtenerFechaHora() {
    const ahora = new Date();
    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const año = ahora.getFullYear();
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    
    return `${dia}/${mes}/${año}, ${hora}:${minutos}`;
}

// Enviar formulario
function enviarFormulario() {
    // Validar paso 3
    if (!validarPaso3()) {
        return;
    }
    
    // Recopilar todos los datos
    recopilarDatos();
    
    // Generar mensaje
    const mensaje = generarMensajeWhatsApp();
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Número de WhatsApp (reemplazar con tu número real)
    const numeroWhatsApp = '5217225368687'; // Cambiar por tu número
    
    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(urlWhatsApp, '_blank');
    
    // Mostrar mensaje de éxito
    mostrarExito('¡Redirigiendo a WhatsApp! En un momento podrás enviar tu mensaje.');
    
    // Opcional: Resetear formulario después de 3 segundos
    setTimeout(() => {
        resetearFormulario();
    }, 3000);
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    // Crear elemento de error si no existe
    let errorDiv = document.getElementById('form-error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'form-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            padding: 1.25rem 1.75rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(220, 53, 69, 0.4);
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = '❌ ' + mensaje;
    errorDiv.style.display = 'block';
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 300);
    }, 4000);
}

// Mostrar mensaje de éxito
function mostrarExito(mensaje) {
    // Crear elemento de éxito si no existe
    let exitoDiv = document.getElementById('form-success-message');
    
    if (!exitoDiv) {
        exitoDiv = document.createElement('div');
        exitoDiv.id = 'form-success-message';
        exitoDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #218838);
            color: white;
            padding: 1.25rem 1.75rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(40, 167, 69, 0.4);
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(exitoDiv);
    }
    
    exitoDiv.textContent = '✅ ' + mensaje;
    exitoDiv.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        exitoDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            exitoDiv.style.display = 'none';
        }, 300);
    }, 5000);
}

// Resetear formulario
function resetearFormulario() {
    // Limpiar objeto de datos
    formularioData = {
        motivo: '',
        motivoTipo: '',
        productos: [],
        cantidad: '',
        programacion: [],
        otroProgramacion: '',
        tipoSoporte: '',
        problemaDetalle: '',
        tipoInfo: '',
        preguntaDetalle: '',
        tipoEmpresa: '',
        cantidadEmpresa: '',
        proyectoDetalle: '',
        nombre: '',
        telefono: '',
        email: '',
        detallesExtra: ''
    };
    
    // Resetear formulario HTML
    document.getElementById('contactForm').reset();
    
    // Remover todas las selecciones
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    // Volver al paso 1
    irAPaso('1');
    
    // Resetear contador de caracteres
    const contador = document.querySelector('.form-counter');
    if (contador) {
        contador.textContent = '0/300 caracteres';
        contador.style.color = 'rgba(250, 250, 250, 0.5)';
    }
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);