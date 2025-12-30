// ============================================================================
// SISTEMA DE GESTIÓN PEDAGÓGICA - EDUCACIÓN PARVULARIA
// Nivel Transición - Bases Curriculares 2019
// Versión UX Mejorada con shadcn/ui
// ============================================================================

// ============================================================================
// SECCIÓN 1: TOAST NOTIFICATION SYSTEM (reemplaza alert/confirm)
// ============================================================================

const toastQueue = [];
const MAX_TOASTS = 3;

function showToast({ title, description, variant = 'info', duration = 5000 }) {
    const container = document.getElementById('toast-container');

    // Limitar máximo de toasts visibles
    if (toastQueue.length >= MAX_TOASTS) {
        const oldestToast = toastQueue.shift();
        if (oldestToast) {
            removeToast(oldestToast.element);
        }
    }

    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${variant}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[variant]}</div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-description">${description}</div>
        </div>
        <button class="toast-close" aria-label="Cerrar notificación">×</button>
    `;

    container.appendChild(toast);
    toastQueue.push({ element: toast, variant });

    // Event listener para cerrar
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });

    // Auto-dismiss
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }
}

function removeToast(toast) {
    if (!toast) return;

    toast.classList.add('toast-exit');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        const index = toastQueue.findIndex(t => t.element === toast);
        if (index > -1) {
            toastQueue.splice(index, 1);
        }
    }, 300);
}

// Función helper para confirmaciones (reemplaza confirm())
function showConfirm({ title, description, onConfirm, onCancel }) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-body">
                <div class="confirm-dialog">
                    <div class="confirm-dialog-icon danger">⚠️</div>
                    <div class="confirm-dialog-title">${title}</div>
                    <div class="confirm-dialog-description">${description}</div>
                    <div class="action-buttons" style="justify-content: center; margin-top: 24px;">
                        <button class="btn btn-ghost" id="confirm-cancel">Cancelar</button>
                        <button class="btn btn-destructive" id="confirm-ok">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#confirm-ok').addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });

    modal.querySelector('#confirm-cancel').addEventListener('click', () => {
        modal.remove();
        if (onCancel) onCancel();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            if (onCancel) onCancel();
        }
    });
}

console.log('✅ Sistema de Toast - Cargado');

// ============================================================================
// SECCIÓN 1.5: SISTEMA DE PERSISTENCIA (localStorage)
// ============================================================================

const STORAGE_KEY = 'educparv_sistema_pedagogico';
const STORAGE_VERSION = '2.0';

function saveToStorage() {
    try {
        const dataToSave = {
            version: STORAGE_VERSION,
            timestamp: new Date().toISOString(),
            data: {
                currentYear: appState.currentYear,
                currentSemestre: appState.currentSemestre,
                selectedUnit: appState.selectedUnit,
                units: appState.units,
                savedObjectives: appState.savedObjectives,
                savedExperiences: appState.savedExperiences,
                savedRecursos: appState.savedRecursos,
                materiales: appState.materiales,
                evaluaciones: appState.evaluaciones,
                planificaciones: appState.planificaciones
            }
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('💾 Datos guardados en memoria local');
        return true;
    } catch (error) {
        console.error('❌ Error al guardar en memoria:', error);
        showToast({
            title: 'Error al guardar',
            description: 'No se pudieron guardar los datos en la memoria local.',
            variant: 'error'
        });
        return false;
    }
}

function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            console.log('📭 No hay datos guardados en memoria local');
            return false;
        }

        const parsed = JSON.parse(stored);

        // Validar versión
        if (parsed.version !== STORAGE_VERSION) {
            console.warn('⚠️ Versión de datos diferente, se requiere migración');
        }

        // Restaurar datos
        if (parsed.data) {
            appState.currentYear = parsed.data.currentYear || 2025;
            appState.currentSemestre = parsed.data.currentSemestre || 1;
            appState.selectedUnit = parsed.data.selectedUnit || null;
            appState.units = parsed.data.units || [];
            appState.savedObjectives = parsed.data.savedObjectives || [];
            appState.savedExperiences = parsed.data.savedExperiences || [];
            appState.savedRecursos = parsed.data.savedRecursos || [];
            appState.materiales = parsed.data.materiales || [];
            appState.evaluaciones = parsed.data.evaluaciones || [];
            appState.planificaciones = parsed.data.planificaciones || [];

            const savedDate = new Date(parsed.timestamp);
            console.log(`📥 Datos cargados desde memoria (guardado: ${savedDate.toLocaleString('es-CL')})`);

            showToast({
                title: 'Datos restaurados',
                description: `Se cargaron tus datos guardados del ${savedDate.toLocaleDateString('es-CL')}.`,
                variant: 'success'
            });

            return true;
        }

        return false;
    } catch (error) {
        console.error('❌ Error al cargar desde memoria:', error);
        return false;
    }
}

function clearStorage() {
    showConfirm({
        title: '¿Borrar toda la memoria?',
        description: 'Esta acción eliminará TODOS los datos guardados: unidades, objetivos, experiencias y recursos. No se puede deshacer.',
        confirmText: 'Sí, borrar todo',
        cancelText: 'Cancelar',
        variant: 'danger',
        onConfirm: () => {
            try {
                localStorage.removeItem(STORAGE_KEY);

                // Resetear estado a valores iniciales
                appState.units = [];
                appState.savedObjectives = [];
                appState.savedExperiences = [];
                appState.savedRecursos = [];
                appState.materiales = [];
                appState.evaluaciones = [];
                appState.planificaciones = [];
                appState.selectedUnit = null;

                // Recargar interfaz
                renderUnits();
                renderSavedObjectives();
                renderSavedExperiences();
                renderRecursos();

                console.log('🗑️ Memoria borrada completamente');

                showToast({
                    title: '¡Memoria borrada!',
                    description: 'Todos los datos han sido eliminados. El sistema está limpio.',
                    variant: 'success'
                });

                // Recargar página después de 2 segundos
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } catch (error) {
                console.error('❌ Error al borrar memoria:', error);
                showToast({
                    title: 'Error',
                    description: 'No se pudo borrar la memoria.',
                    variant: 'error'
                });
            }
        }
    });
}

function exportData() {
    try {
        const dataToExport = {
            version: STORAGE_VERSION,
            exportDate: new Date().toISOString(),
            schoolName: 'Complejo Educacional Valle del Itata',
            data: {
                currentYear: appState.currentYear,
                currentSemestre: appState.currentSemestre,
                units: appState.units,
                savedObjectives: appState.savedObjectives,
                savedExperiences: appState.savedExperiences,
                savedRecursos: appState.savedRecursos,
                materiales: appState.materiales,
                evaluaciones: appState.evaluaciones,
                planificaciones: appState.planificaciones
            }
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `educparv_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast({
            title: 'Datos exportados',
            description: 'El archivo de respaldo se ha descargado correctamente.',
            variant: 'success'
        });

        console.log('📤 Datos exportados correctamente');
    } catch (error) {
        console.error('❌ Error al exportar datos:', error);
        showToast({
            title: 'Error al exportar',
            description: 'No se pudieron exportar los datos.',
            variant: 'error'
        });
    }
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);

                // Validar estructura
                if (!imported.data || !imported.version) {
                    throw new Error('Formato de archivo inválido');
                }

                showConfirm({
                    title: '¿Importar datos?',
                    description: 'Esto reemplazará TODOS los datos actuales con los del archivo. ¿Desea continuar?',
                    confirmText: 'Sí, importar',
                    cancelText: 'Cancelar',
                    variant: 'warning',
                    onConfirm: () => {
                        // Restaurar datos
                        appState.currentYear = imported.data.currentYear || 2025;
                        appState.currentSemestre = imported.data.currentSemestre || 1;
                        appState.units = imported.data.units || [];
                        appState.savedObjectives = imported.data.savedObjectives || [];
                        appState.savedExperiences = imported.data.savedExperiences || [];
                        appState.savedRecursos = imported.data.savedRecursos || [];
                        appState.materiales = imported.data.materiales || [];
                        appState.evaluaciones = imported.data.evaluaciones || [];
                        appState.planificaciones = imported.data.planificaciones || [];

                        // Guardar en localStorage
                        saveToStorage();

                        // Recargar interfaz
                        renderUnits();
                        renderSavedObjectives();
                        renderSavedExperiences();
                        renderRecursos();

                        showToast({
                            title: '¡Datos importados!',
                            description: 'Los datos se han restaurado correctamente.',
                            variant: 'success'
                        });

                        console.log('📥 Datos importados desde archivo');
                    }
                });
            } catch (error) {
                console.error('❌ Error al importar datos:', error);
                showToast({
                    title: 'Error al importar',
                    description: 'El archivo no tiene el formato correcto.',
                    variant: 'error'
                });
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

console.log('✅ Sistema de Persistencia - Cargado');

// ============================================================================
// SECCIÓN 2: ESTADO GLOBAL + STEPPER STATE
// ============================================================================

const appState = {
    currentYear: 2025,
    currentSemestre: 1,
    selectedUnit: null,
    units: [],

    // Stepper state
    currentStep: 1,
    completedSteps: [],

    selectedAmbito: null,
    selectedNucleo: null,
    selectedOAs: [],
    selectedOATs: [],
    selectedTercerOA: null,
    specificObjective: '',
    indicators: [],

    savedObjectives: [],
    savedExperiences: [],
    savedRecursos: [],
    materiales: [],
    evaluaciones: [],
    planificaciones: []
};

console.log('✅ Estado Global - Inicializado');

// ============================================================================
// SECCIÓN 3: INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Gestión Pedagógica - Inicializado');

    initializeApp();
    setupEventListeners();

    // Intentar cargar datos desde memoria
    const dataLoaded = loadFromStorage();

    // Si no hay datos, cargar unidades por defecto
    if (!dataLoaded || appState.units.length === 0) {
        loadDefaultUnits();
    } else {
        // Si hay datos, renderizar todo
        renderUnits();
        renderSavedObjectives();
        renderSavedExperiences();
        renderRecursos();
    }

    // Toast de bienvenida solo si NO hay datos guardados
    if (!dataLoaded) {
        setTimeout(() => {
            showToast({
                title: '¡Bienvenida!',
                description: 'Sistema de gestión pedagógica listo para usar.',
                variant: 'info',
                duration: 3000
            });
        }, 500);
    }
});

function initializeApp() {
    appState.materiales = [];
    renderSavedObjectives();
    renderSavedExperiences();
    initializeStepper();
}

function loadDefaultUnits() {
    const defaultUnits = [
        {
            id: 1,
            name: 'Los seres vivos',
            description: 'Exploración y conocimiento de plantas y animales',
            semester: 1,
            fechaInicio: '2025-03-03',
            fechaFin: '2025-04-11'
        },
        {
            id: 2,
            name: 'Mi familia y comunidad',
            description: 'Conociendo nuestro entorno social cercano',
            semester: 1,
            fechaInicio: '2025-04-14',
            fechaFin: '2025-05-23'
        },
        {
            id: 3,
            name: 'Los oficios y profesiones',
            description: 'Descubriendo el mundo del trabajo',
            semester: 1,
            fechaInicio: '2025-05-26',
            fechaFin: '2025-06-27'
        },
        {
            id: 4,
            name: 'Las estaciones del año',
            description: 'Cambios en la naturaleza y el tiempo',
            semester: 1,
            fechaInicio: '2025-06-30',
            fechaFin: '2025-07-18'
        },
        {
            id: 5,
            name: 'Medios de transporte',
            description: 'Cómo nos movemos en nuestra ciudad',
            semester: 2,
            fechaInicio: '2025-08-04',
            fechaFin: '2025-09-05'
        },
        {
            id: 6,
            name: 'El universo y los planetas',
            description: 'Explorando el espacio',
            semester: 2,
            fechaInicio: '2025-09-22',
            fechaFin: '2025-10-24'
        },
        {
            id: 7,
            name: 'Tradiciones de Chile',
            description: 'Celebrando nuestras raíces',
            semester: 2,
            fechaInicio: '2025-10-27',
            fechaFin: '2025-11-28'
        },
        {
            id: 8,
            name: 'Preparándonos para el colegio',
            description: 'Transición a educación básica',
            semester: 2,
            fechaInicio: '2025-12-01',
            fechaFin: '2025-12-20'
        }
    ];

    appState.units = defaultUnits;
    renderUnits();
}

console.log('✅ Inicialización - Completada');

// ============================================================================
// SECCIÓN 4: STEPPER LOGIC (WIZARD DE OBJETIVOS)
// ============================================================================

function initializeStepper() {
    appState.currentStep = 1;
    appState.completedSteps = [];
    updateStepperUI();
}

function updateStepperUI() {
    // Actualizar visual del stepper
    document.querySelectorAll('.stepper-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum === appState.currentStep) {
            step.classList.add('active');
        } else if (appState.completedSteps.includes(stepNum)) {
            step.classList.add('completed');
        }
    });

    // Mostrar/ocultar steps de contenido
    document.querySelectorAll('.objective-step').forEach((stepContent, index) => {
        stepContent.style.display = (index + 1) === appState.currentStep ? 'block' : 'none';
    });

    // Si llegamos al paso 4, mostrar sección de indicadores
    if (appState.currentStep === 4) {
        const indicatorsSection = document.getElementById('indicators-section');
        indicatorsSection.style.display = 'block';

        // Si no hay indicadores, agregar uno vacío por defecto
        if (appState.indicators.length === 0) {
            appState.indicators.push({
                id: 0,
                text: '',
                editable: true
            });
            renderIndicators();
        }
    }

    // Actualizar botones de navegación
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const saveBtn = document.getElementById('save-objective-btn');

    prevBtn.style.display = appState.currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = appState.currentStep < 5 ? 'block' : 'none';
    saveBtn.style.display = appState.currentStep === 5 ? 'block' : 'none';
}

function nextStep() {
    // Validar paso actual antes de avanzar
    if (!validateCurrentStep()) {
        return;
    }

    // Marcar paso actual como completado
    if (!appState.completedSteps.includes(appState.currentStep)) {
        appState.completedSteps.push(appState.currentStep);
    }

    // Avanzar al siguiente paso
    if (appState.currentStep < 5) {
        appState.currentStep++;

        // Si llegamos al paso 5, generar resumen
        if (appState.currentStep === 5) {
            generateObjectiveSummary();
        }

        updateStepperUI();

        // Smooth scroll al inicio del stepper
        document.getElementById('objectives-stepper').scrollIntoView({ behavior: 'smooth' });
    }
}

function prevStep() {
    if (appState.currentStep > 1) {
        appState.currentStep--;
        updateStepperUI();
        document.getElementById('objectives-stepper').scrollIntoView({ behavior: 'smooth' });
    }
}

function validateCurrentStep() {
    switch (appState.currentStep) {
        case 1:
            if (!appState.selectedAmbito || !appState.selectedNucleo) {
                showToast({
                    title: 'Campos requeridos',
                    description: 'Debe seleccionar un ámbito y un núcleo de aprendizaje.',
                    variant: 'warning'
                });
                return false;
            }
            // Cargar OAs y OATs para los siguientes pasos
            loadObjectives();
            return true;

        case 2:
            if (appState.selectedOAs.length === 0) {
                showToast({
                    title: 'Seleccione objetivos',
                    description: 'Debe seleccionar al menos 1 Objetivo de Aprendizaje (OA).',
                    variant: 'warning'
                });
                return false;
            }
            if (appState.selectedOAs.length > 2) {
                showToast({
                    title: 'Máximo 2 objetivos',
                    description: 'Puede seleccionar máximo 2 OAs. Use el paso 4 para agregar un tercero opcional.',
                    variant: 'warning'
                });
                return false;
            }
            return true;

        case 3:
            if (appState.selectedOATs.length === 0) {
                showToast({
                    title: 'Seleccione OAT',
                    description: 'Debe seleccionar al menos 1 Objetivo Transversal (OAT).',
                    variant: 'warning'
                });
                return false;
            }
            return true;

        case 4:
            const specificText = document.getElementById('specific-objective-text').value.trim();
            if (!specificText) {
                showToast({
                    title: 'Objetivo específico requerido',
                    description: 'Debe escribir el objetivo específico que trabajará.',
                    variant: 'warning'
                });
                return false;
            }
            appState.specificObjective = specificText;

            if (appState.indicators.filter(i => i.text.trim()).length === 0) {
                showToast({
                    title: 'Indicadores requeridos',
                    description: 'Debe tener al menos un indicador de evaluación.',
                    variant: 'warning'
                });
                return false;
            }
            return true;

        default:
            return true;
    }
}

function generateObjectiveSummary() {
    const ambito = AMBITOS[appState.selectedAmbito];
    const nucleo = ambito.nucleos[appState.selectedNucleo];
    const oatsDelNucleo = OAT_POR_NUCLEO[appState.selectedNucleo] || OAT;

    const summaryHTML = `
        <div class="card-header">
            <h4>Resumen del Objetivo</h4>
        </div>
        <div class="card-content">
            <p><strong>Ámbito:</strong> ${ambito.nombre}</p>
            <p><strong>Núcleo:</strong> ${nucleo.nombre}</p>

            <p><strong>Objetivo Específico:</strong></p>
            <p style="background: var(--accent-bg); padding: 12px; border-radius: 6px; margin: 8px 0;">
                ${appState.specificObjective}
            </p>

            <p><strong>Objetivos de Aprendizaje (${appState.selectedOAs.length}):</strong></p>
            <ul>
                ${appState.selectedOAs.map(i => `<li>${nucleo.oa[i].codigo}: ${nucleo.oa[i].texto}</li>`).join('')}
            </ul>

            ${appState.selectedTercerOA ? `
                <p><strong>Objetivo Adicional:</strong></p>
                <ul>
                    <li>${nucleo.oa[appState.selectedTercerOA].codigo}: ${nucleo.oa[appState.selectedTercerOA].texto}</li>
                </ul>
            ` : ''}

            <p><strong>Objetivos Transversales (${appState.selectedOATs.length}):</strong></p>
            <ul>
                ${appState.selectedOATs.map(i => `<li>${oatsDelNucleo[i].codigo}: ${oatsDelNucleo[i].texto}</li>`).join('')}
            </ul>

            <p><strong>Indicadores de Evaluación (${appState.indicators.length}):</strong></p>
            <ol>
                ${appState.indicators.map(ind => `<li>${ind.text}</li>`).join('')}
            </ol>
        </div>
    `;

    document.getElementById('objective-summary').innerHTML = summaryHTML;
}

console.log('✅ Stepper Logic - Cargado');

// ============================================================================
// SECCIÓN 5: GESTIÓN DE UNIDADES
// ============================================================================

function renderUnits() {
    const container = document.getElementById('units-container');
    const filteredUnits = appState.units.filter(u => u.semester === appState.currentSemestre);

    if (filteredUnits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>No hay unidades en este semestre</h3>
                <p>Cree la primera unidad pedagógica para comenzar.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredUnits.map(unit => {
        const fechaInicio = unit.fechaInicio ? formatearFecha(unit.fechaInicio) : 'No definida';
        const fechaFin = unit.fechaFin ? formatearFecha(unit.fechaFin) : 'No definida';
        const efemerides = unit.fechaInicio && unit.fechaFin ?
            obtenerEfemeridesRango(unit.fechaInicio, unit.fechaFin) : [];
        const numEfemerides = efemerides.length;

        return `
            <div class="unit-card ${appState.selectedUnit === unit.id ? 'active' : ''}"
                 onclick="selectUnit(${unit.id})">
                <div class="unit-badge">Unidad ${unit.id}</div>
                <h3>${unit.name}</h3>
                <p>${unit.description}</p>
                <div class="unit-dates">
                    <div class="unit-date-item">
                        <span>📅</span>
                        <span>${fechaInicio}</span>
                    </div>
                    <div class="unit-date-item">
                        <span>→</span>
                        <span>${fechaFin}</span>
                    </div>
                </div>
                ${numEfemerides > 0 ? `
                    <div style="margin-top: 10px;">
                        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;"
                                onclick="event.stopPropagation(); verEfemerides(${unit.id})">
                            📌 ${numEfemerides} Efeméride${numEfemerides > 1 ? 's' : ''}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    updateUnitSelectors();
}

function selectUnit(unitId) {
    appState.selectedUnit = unitId;
    renderUnits();

    const unit = appState.units.find(u => u.id === unitId);
    showToast({
        title: 'Unidad seleccionada',
        description: `Trabajando en: ${unit.name}`,
        variant: 'info',
        duration: 2000
    });
}

function updateUnitSelectors() {
    const filteredUnits = appState.units.filter(u => u.semester === appState.currentSemestre);
    const options = filteredUnits.map(u =>
        `<option value="${u.id}">${u.name}</option>`
    ).join('');

    const selectors = [
        'experience-unit',
        'registro-unit',
        'report-curso-unit',
        'planificacion-unit',
        'recurso-unidad'
    ];

    selectors.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const currentValue = element.value;
            const baseOptions = id === 'report-curso-unit' ?
                '<option value="">Todas las unidades</option>' :
                id === 'recurso-unidad' ?
                '<option value="">Ninguna (recurso general)</option>' :
                '<option value="">Seleccione una unidad...</option>';

            element.innerHTML = baseOptions + options;
            element.value = currentValue;
        }
    });
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return 'No definida';
    const fecha = new Date(fechaStr + 'T00:00:00');
    const opciones = { day: '2-digit', month: 'short' };
    return fecha.toLocaleDateString('es-CL', opciones);
}

function verEfemerides(unitId) {
    const unit = appState.units.find(u => u.id === unitId);
    if (!unit || !unit.fechaInicio || !unit.fechaFin) return;

    const efemerides = obtenerEfemeridesRango(unit.fechaInicio, unit.fechaFin);
    const modal = document.getElementById('efemerides-modal');
    const content = document.getElementById('efemerides-content');

    content.innerHTML = `
        <div class="efemerides-section">
            <h4>📌 Efemérides de la unidad "${unit.name}"</h4>
            <p class="help-text">Del ${formatearFecha(unit.fechaInicio)} al ${formatearFecha(unit.fechaFin)}</p>
            ${efemerides.length > 0 ? efemerides.map(ef => `
                <div class="efemeride-item">
                    <span class="efemeride-date">${ef.fecha}</span>
                    <span class="efemeride-title">${ef.titulo}</span>
                </div>
            `).join('') : '<p>No hay efemérides en este período.</p>'}
        </div>
    `;

    modal.classList.add('active');
}

function openUnitModal() {
    document.getElementById('unit-modal').classList.add('active');
    document.getElementById('unit-name').value = '';
    document.getElementById('unit-description').value = '';
    document.getElementById('unit-fecha-inicio').value = '';
    document.getElementById('unit-fecha-fin').value = '';
}

function saveNewUnit() {
    const name = document.getElementById('unit-name').value.trim();
    const description = document.getElementById('unit-description').value.trim();
    const fechaInicio = document.getElementById('unit-fecha-inicio').value;
    const fechaFin = document.getElementById('unit-fecha-fin').value;

    if (!name) {
        showToast({
            title: 'Campo requerido',
            description: 'Por favor, ingrese el nombre de la unidad.',
            variant: 'warning'
        });
        return;
    }

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
        showToast({
            title: 'Fechas inválidas',
            description: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
            variant: 'error'
        });
        return;
    }

    const newUnit = {
        id: appState.units.length + 1,
        name,
        description: description || 'Sin descripción',
        semester: appState.currentSemestre,
        fechaInicio: fechaInicio || null,
        fechaFin: fechaFin || null
    };

    appState.units.push(newUnit);

    // Guardar en memoria local
    saveToStorage();

    renderUnits();
    closeModals();

    showToast({
        title: '¡Unidad creada!',
        description: `La unidad "${name}" fue agregada exitosamente.`,
        variant: 'success'
    });
}

console.log('✅ Gestión de Unidades - Cargado');

// ============================================================================
// SECCIÓN 6: GESTIÓN DE OBJETIVOS (CON STEPPER)
// ============================================================================

function handleAmbitoChange(e) {
    const ambitoKey = e.target.value;
    appState.selectedAmbito = ambitoKey;
    appState.selectedNucleo = null;
    appState.selectedOAs = [];
    appState.selectedOATs = [];
    appState.selectedTercerOA = null;

    const nucleoSelect = document.getElementById('nucleo-select');

    if (!ambitoKey) {
        nucleoSelect.disabled = true;
        nucleoSelect.innerHTML = '<option value="">Seleccione un núcleo...</option>';
        return;
    }

    const ambito = AMBITOS[ambitoKey];
    const nucleoOptions = Object.keys(ambito.nucleos).map(key => {
        const nucleo = ambito.nucleos[key];
        return `<option value="${key}">${nucleo.nombre}</option>`;
    }).join('');

    nucleoSelect.disabled = false;
    nucleoSelect.innerHTML = '<option value="">Seleccione un núcleo...</option>' + nucleoOptions;
}

function handleNucleoChange(e) {
    const nucleoKey = e.target.value;
    appState.selectedNucleo = nucleoKey;
}

function loadObjectives() {
    const ambito = AMBITOS[appState.selectedAmbito];
    const nucleo = ambito.nucleos[appState.selectedNucleo];

    // Cargar OAs en paso 2
    const oaList = document.getElementById('oa-list');
    oaList.innerHTML = nucleo.oa.map((oa, index) => `
        <div class="checkbox-item">
            <input type="checkbox" id="oa-${index}" value="${index}" onchange="handleOAChange()">
            <label for="oa-${index}">
                <span class="objective-code">${oa.codigo}</span>
                ${oa.texto}
            </label>
        </div>
    `).join('');

    // Cargar OATs específicos del núcleo en paso 3
    const oatList = document.getElementById('oat-list');
    const oatsDelNucleo = OAT_POR_NUCLEO[appState.selectedNucleo] || OAT;

    oatList.innerHTML = oatsDelNucleo.map((oat, index) => `
        <div class="checkbox-item">
            <input type="checkbox" id="oat-${index}" value="${index}" onchange="handleOATChange()">
            <label for="oat-${index}">
                <span class="objective-code">${oat.codigo}</span>
                ${oat.texto}
            </label>
        </div>
    `).join('');
}

function handleOAChange() {
    appState.selectedOAs = Array.from(document.querySelectorAll('#oa-list input:checked'))
        .map(input => parseInt(input.value));

    loadTercerObjetivoOptions();
}

function handleOATChange() {
    appState.selectedOATs = Array.from(document.querySelectorAll('#oat-list input:checked'))
        .map(input => parseInt(input.value));
}

function loadTercerObjetivoOptions() {
    const tercerSelect = document.getElementById('tercer-oa-select');
    if (!tercerSelect || !appState.selectedAmbito || !appState.selectedNucleo) return;

    const ambito = AMBITOS[appState.selectedAmbito];
    const nucleo = ambito.nucleos[appState.selectedNucleo];

    const oasDisponibles = nucleo.oa.filter((oa, index) =>
        !appState.selectedOAs.includes(index)
    );

    tercerSelect.innerHTML = '<option value="">Ninguno</option>' +
        oasDisponibles.map((oa, originalIndex) => {
            const realIndex = nucleo.oa.findIndex(o => o.codigo === oa.codigo);
            return `<option value="${realIndex}">${oa.codigo}: ${oa.texto.substring(0, 80)}...</option>`;
        }).join('');

    tercerSelect.onchange = function(e) {
        appState.selectedTercerOA = e.target.value ? parseInt(e.target.value) : null;
    };
}

// Auto-generar indicadores cuando se escribe el objetivo específico
document.addEventListener('DOMContentLoaded', function() {
    const specificTextarea = document.getElementById('specific-objective-text');
    if (specificTextarea) {
        specificTextarea.addEventListener('input', function(e) {
            if (e.target.value.trim().length > 20 && appState.indicators.length === 0) {
                loadSuggestedIndicators();
            }
        });
    }
});

function loadSuggestedIndicators() {
    const indicators = generarIndicadoresSugeridos(appState.selectedNucleo);
    appState.indicators = indicators.map((text, index) => ({
        id: index,
        text: text,
        editable: true
    }));

    renderIndicators();
    document.getElementById('indicators-section').style.display = 'block';
}

function renderIndicators() {
    const container = document.getElementById('indicators-list');

    container.innerHTML = appState.indicators.map((indicator, index) => `
        <div class="indicator-item">
            <input type="text" value="${indicator.text}"
                   onchange="updateIndicator(${index}, this.value)"
                   placeholder="Escriba el indicador...">
            <div class="indicator-actions">
                <button class="btn btn-danger" onclick="removeIndicator(${index})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function updateIndicator(index, newText) {
    appState.indicators[index].text = newText;
}

function removeIndicator(index) {
    appState.indicators.splice(index, 1);
    renderIndicators();
}

function addCustomIndicator() {
    appState.indicators.push({
        id: appState.indicators.length,
        text: '',
        editable: true
    });
    renderIndicators();
}

function saveObjective() {
    if (!appState.selectedUnit) {
        showToast({
            title: 'Unidad no seleccionada',
            description: 'Por favor, seleccione una unidad pedagógica primero en la sección superior.',
            variant: 'warning'
        });
        return;
    }

    const ambito = AMBITOS[appState.selectedAmbito];
    const nucleo = ambito.nucleos[appState.selectedNucleo];
    const oatsDelNucleo = OAT_POR_NUCLEO[appState.selectedNucleo] || OAT;

    const objective = {
        id: Date.now(),
        unitId: appState.selectedUnit,
        ambito: ambito.nombre,
        nucleo: nucleo.nombre,
        nucleoKey: appState.selectedNucleo,
        oas: appState.selectedOAs.map(i => nucleo.oa[i]),
        oats: appState.selectedOATs.map(i => oatsDelNucleo[i]),
        tercerOA: appState.selectedTercerOA !== null ? nucleo.oa[appState.selectedTercerOA] : null,
        specificObjective: appState.specificObjective,
        indicators: appState.indicators.filter(i => i.text.trim())
    };

    appState.savedObjectives.push(objective);

    // Guardar en memoria local
    saveToStorage();

    showToast({
        title: '¡Objetivo guardado!',
        description: 'El objetivo fue agregado a la unidad exitosamente.',
        variant: 'success'
    });

    clearObjectiveForm();
    renderSavedObjectives();
}

function clearObjectiveForm() {
    document.getElementById('ambito-select').value = '';
    document.getElementById('nucleo-select').value = '';
    document.getElementById('nucleo-select').disabled = true;
    document.getElementById('specific-objective-text').value = '';
    if (document.getElementById('tercer-oa-select')) {
        document.getElementById('tercer-oa-select').value = '';
    }

    appState.selectedAmbito = null;
    appState.selectedNucleo = null;
    appState.selectedOAs = [];
    appState.selectedOATs = [];
    appState.selectedTercerOA = null;
    appState.specificObjective = '';
    appState.indicators = [];

    // Reset stepper
    initializeStepper();
}

function renderSavedObjectives() {
    const container = document.getElementById('saved-objectives-list');

    if (appState.savedObjectives.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <h3>Aún no hay objetivos creados</h3>
                <p>Los objetivos de aprendizaje son la base de tu planificación pedagógica. Usa el asistente arriba para crear tu primer objetivo.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appState.savedObjectives.map(obj => {
        const unit = appState.units.find(u => u.id === obj.unitId);
        return `
            <div class="saved-item">
                <h4>${obj.specificObjective}</h4>
                <p><strong>Ámbito:</strong> ${obj.ambito}</p>
                <p><strong>Núcleo:</strong> ${obj.nucleo}</p>
                <p><strong>Unidad:</strong> ${unit ? unit.name : 'N/A'}</p>
                <div class="item-meta">
                    <span class="badge badge-default">${obj.oas.length} OA(s)</span>
                    <span class="badge badge-secondary">${obj.oats.length} OAT(s)</span>
                    ${obj.tercerOA ? '<span class="badge badge-outline">+ 1 OA Adicional</span>' : ''}
                    <span class="badge badge-info">${obj.indicators.length} Indicadores</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-outline" onclick="viewObjectiveDetails(${obj.id})">Ver Detalles</button>
                    <button class="btn btn-destructive" onclick="deleteObjective(${obj.id})">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

function viewObjectiveDetails(objId) {
    const obj = appState.savedObjectives.find(o => o.id === objId);
    if (!obj) return;

    let details = `OBJETIVO ESPECÍFICO:\n${obj.specificObjective}\n\n`;
    details += `OBJETIVOS DE APRENDIZAJE (OA):\n`;
    obj.oas.forEach(oa => details += `- ${oa.codigo}: ${oa.texto}\n`);

    if (obj.tercerOA) {
        details += `\nOBJETIVO ADICIONAL:\n- ${obj.tercerOA.codigo}: ${obj.tercerOA.texto}\n`;
    }

    details += `\nOBJETIVOS TRANSVERSALES (OAT):\n`;
    obj.oats.forEach(oat => details += `- ${oat.codigo}: ${oat.texto}\n`);
    details += `\nINDICADORES:\n`;
    obj.indicators.forEach((ind, i) => details += `${i+1}. ${ind.text}\n`);

    showToast({
        title: 'Detalles del Objetivo',
        description: 'Revise la consola para ver el detalle completo',
        variant: 'info'
    });
    console.log(details);
}

function deleteObjective(objId) {
    showConfirm({
        title: '¿Eliminar objetivo?',
        description: 'Esta acción no se puede deshacer. ¿Está seguro de eliminar este objetivo?',
        onConfirm: () => {
            appState.savedObjectives = appState.savedObjectives.filter(o => o.id !== objId);

            // Guardar en memoria local
            saveToStorage();

            renderSavedObjectives();
            showToast({
                title: 'Objetivo eliminado',
                description: 'El objetivo fue eliminado correctamente.',
                variant: 'success'
            });
        }
    });
}

console.log('✅ Gestión de Objetivos - Cargado');

// ============================================================================
// SECCIÓN 7: GESTIÓN DE EXPERIENCIAS
// ============================================================================

function loadObjectivesForExperiences() {
    const select = document.getElementById('objective-for-experience');
    select.innerHTML = '<option value="">Seleccione un objetivo guardado...</option>' +
        appState.savedObjectives.map(obj =>
            `<option value="${obj.id}">${obj.specificObjective}</option>`
        ).join('');
}

function openBankModal() {
    const modal = document.getElementById('bank-modal');
    modal.classList.add('active');

    const nucleoFilter = document.getElementById('bank-nucleo-filter');
    const allNucleos = [];

    Object.values(AMBITOS).forEach(ambito => {
        Object.entries(ambito.nucleos).forEach(([key, nucleo]) => {
            allNucleos.push({ key, nombre: nucleo.nombre });
        });
    });

    nucleoFilter.innerHTML = '<option value="">Todos los núcleos</option>' +
        allNucleos.map(n => `<option value="${n.key}">${n.nombre}</option>`).join('');

    nucleoFilter.onchange = () => renderBankExperiences(nucleoFilter.value);

    renderBankExperiences();
}

function renderBankExperiences(filterNucleo = '') {
    const container = document.getElementById('bank-experiences-list');

    let experiences = BANCO_EXPERIENCIAS;
    if (filterNucleo) {
        experiences = experiences.filter(exp => exp.nucleo === filterNucleo);
    }

    container.innerHTML = experiences.map((exp, index) => `
        <div class="bank-experience-card" onclick="loadExperienceFromBank(${index})">
            <h4>${exp.titulo}</h4>
            <span class="badge badge-info">${getNucleoName(exp.nucleo)}</span>
            <p><strong>Inicio:</strong> ${exp.inicio.substring(0, 100)}...</p>
        </div>
    `).join('');
}

function getNucleoName(nucleoKey) {
    for (let ambito of Object.values(AMBITOS)) {
        if (ambito.nucleos[nucleoKey]) {
            return ambito.nucleos[nucleoKey].nombre;
        }
    }
    return nucleoKey;
}

function loadExperienceFromBank(index) {
    const exp = BANCO_EXPERIENCIAS[index];

    document.getElementById('experience-inicio').value = exp.inicio;
    document.getElementById('experience-desarrollo').value = exp.desarrollo;
    document.getElementById('experience-cierre').value = exp.cierre;

    closeModals();
    showToast({
        title: 'Experiencia cargada',
        description: `"${exp.titulo}" fue cargada. Puede modificarla según sus necesidades.`,
        variant: 'success'
    });
}

function renderMateriales() {
    const container = document.getElementById('materiales-list');

    if (appState.materiales.length === 0) {
        container.innerHTML = '<p class="help-text">No hay materiales agregados.</p>';
        return;
    }

    container.innerHTML = appState.materiales.map((material, index) => `
        <div class="material-item">
            <input type="checkbox" class="material-checkbox" checked disabled>
            <input type="text" value="${material.nombre}"
                   onchange="updateMaterial(${index}, 'nombre', this.value)"
                   placeholder="Nombre del material">
            <input type="number" value="${material.cantidad}" min="1"
                   onchange="updateMaterial(${index}, 'cantidad', this.value)"
                   placeholder="Cant.">
            <button class="btn btn-danger" style="padding: 6px 12px;"
                    onclick="removeMaterial(${index})">×</button>
        </div>
    `).join('');
}

function addMaterial() {
    appState.materiales.push({
        nombre: '',
        cantidad: 1
    });
    renderMateriales();
}

function updateMaterial(index, field, value) {
    appState.materiales[index][field] = field === 'cantidad' ? parseInt(value) : value;
}

function removeMaterial(index) {
    appState.materiales.splice(index, 1);
    renderMateriales();
}

function saveExperience() {
    const objectiveId = document.getElementById('objective-for-experience').value;
    const unitId = document.getElementById('experience-unit').value;
    const inicio = document.getElementById('experience-inicio').value;
    const desarrollo = document.getElementById('experience-desarrollo').value;
    const cierre = document.getElementById('experience-cierre').value;

    if (!objectiveId || !unitId) {
        showToast({
            title: 'Campos requeridos',
            description: 'Por favor, seleccione un objetivo y una unidad pedagógica.',
            variant: 'warning'
        });
        return;
    }

    if (!inicio.trim() || !desarrollo.trim() || !cierre.trim()) {
        showToast({
            title: 'Complete las fases',
            description: 'Por favor, complete las tres fases de la experiencia (Inicio, Desarrollo, Cierre).',
            variant: 'warning'
        });
        return;
    }

    const objective = appState.savedObjectives.find(o => o.id == objectiveId);
    const unit = appState.units.find(u => u.id == unitId);

    const experience = {
        id: Date.now(),
        objectiveId: parseInt(objectiveId),
        unitId: parseInt(unitId),
        objectiveName: objective.specificObjective,
        unitName: unit.name,
        inicio,
        desarrollo,
        cierre,
        materiales: [...appState.materiales]
    };

    appState.savedExperiences.push(experience);

    // Guardar en memoria local
    saveToStorage();

    showToast({
        title: '¡Experiencia guardada!',
        description: 'La experiencia de aprendizaje fue guardada exitosamente.',
        variant: 'success'
    });

    clearExperienceForm();
    renderSavedExperiences();
}

function clearExperienceForm() {
    document.getElementById('objective-for-experience').value = '';
    document.getElementById('experience-unit').value = '';
    document.getElementById('experience-inicio').value = '';
    document.getElementById('experience-desarrollo').value = '';
    document.getElementById('experience-cierre').value = '';
    appState.materiales = [];
    renderMateriales();
}

function renderSavedExperiences() {
    const container = document.getElementById('saved-experiences-list');

    if (appState.savedExperiences.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No hay experiencias creadas</h3>
                <p>Diseñe experiencias de aprendizaje significativas para sus estudiantes.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appState.savedExperiences.map(exp => `
        <div class="saved-item">
            <h4>Experiencia de Aprendizaje</h4>
            <p><strong>Objetivo:</strong> ${exp.objectiveName}</p>
            <p><strong>Unidad:</strong> ${exp.unitName}</p>
            ${exp.materiales && exp.materiales.length > 0 ?
                `<p><strong>Materiales:</strong> ${exp.materiales.length} item(s)</p>` : ''}
            <div class="item-actions">
                <button class="btn btn-outline" onclick="viewExperienceDetails(${exp.id})">Ver Detalles</button>
                <button class="btn btn-destructive" onclick="deleteExperience(${exp.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function viewExperienceDetails(expId) {
    const exp = appState.savedExperiences.find(e => e.id === expId);
    if (!exp) return;

    let details = `EXPERIENCIA DE APRENDIZAJE\n\n`;
    details += `Objetivo: ${exp.objectiveName}\n`;
    details += `Unidad: ${exp.unitName}\n\n`;
    details += `INICIO:\n${exp.inicio}\n\n`;
    details += `DESARROLLO:\n${exp.desarrollo}\n\n`;
    details += `CIERRE:\n${exp.cierre}\n\n`;

    if (exp.materiales && exp.materiales.length > 0) {
        details += `MATERIALES:\n`;
        exp.materiales.forEach(m => details += `- ${m.nombre} (${m.cantidad})\n`);
    }

    showToast({
        title: 'Detalles de Experiencia',
        description: 'Revise la consola para ver el detalle completo',
        variant: 'info'
    });
    console.log(details);
}

function deleteExperience(expId) {
    showConfirm({
        title: '¿Eliminar experiencia?',
        description: 'Esta acción no se puede deshacer. ¿Está seguro?',
        onConfirm: () => {
            appState.savedExperiences = appState.savedExperiences.filter(e => e.id !== expId);
            renderSavedExperiences();
            showToast({
                title: 'Experiencia eliminada',
                description: 'La experiencia fue eliminada correctamente.',
                variant: 'success'
            });
        }
    });
}

console.log('✅ Gestión de Experiencias - Cargado');

// ============================================================================
// SECCIÓN 8: RECURSOS
// ============================================================================

let uploadedFiles = [];

function setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('file-upload-area');

    uploadArea.onclick = () => fileInput.click();

    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    };

    uploadArea.ondragleave = () => uploadArea.classList.remove('dragover');

    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    };

    fileInput.onchange = (e) => handleFiles(e.target.files);
}

function handleFiles(files) {
    uploadedFiles = Array.from(files);
    showToast({
        title: 'Archivos seleccionados',
        description: `${files.length} archivo(s): ${Array.from(files).map(f => f.name).join(', ')}`,
        variant: 'info',
        duration: 3000
    });
}

function saveRecurso() {
    const nombre = document.getElementById('recurso-nombre').value.trim();
    const descripcion = document.getElementById('recurso-descripcion').value.trim();
    const unitId = document.getElementById('recurso-unidad').value;

    if (!nombre) {
        showToast({
            title: 'Campo requerido',
            description: 'Ingrese el nombre del recurso.',
            variant: 'warning'
        });
        return;
    }

    const recurso = {
        id: Date.now(),
        nombre,
        descripcion,
        unitId: unitId ? parseInt(unitId) : null,
        files: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        fecha: new Date().toLocaleDateString('es-CL')
    };

    appState.savedRecursos.push(recurso);
    renderRecursos();
    clearRecursoForm();

    showToast({
        title: '¡Recurso guardado!',
        description: `"${nombre}" fue guardado exitosamente.`,
        variant: 'success'
    });
}

function renderRecursos() {
    const container = document.getElementById('saved-recursos-list');

    if (appState.savedRecursos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📂</div>
                <h3>No hay recursos guardados</h3>
                <p>Suba guías, presentaciones y material pedagógico para tenerlo organizado.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appState.savedRecursos.map(rec => `
        <div class="recurso-card">
            <div class="recurso-header">
                <div class="recurso-info">
                    <h4>${rec.nombre}</h4>
                    <div class="recurso-meta">
                        <span>📅 ${rec.fecha}</span>
                        <span>📎 ${rec.files.length} archivo(s)</span>
                    </div>
                </div>
                <div class="recurso-icon">📄</div>
            </div>
            <p class="recurso-description">${rec.descripcion || 'Sin descripción'}</p>
            <div class="recurso-actions">
                <button class="btn btn-destructive" onclick="deleteRecurso(${rec.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function deleteRecurso(id) {
    showConfirm({
        title: '¿Eliminar recurso?',
        description: 'Esta acción no se puede deshacer.',
        onConfirm: () => {
            appState.savedRecursos = appState.savedRecursos.filter(r => r.id !== id);

            // Guardar en memoria local
            saveToStorage();

            renderRecursos();
            showToast({
                title: 'Recurso eliminado',
                description: 'El recurso fue eliminado correctamente.',
                variant: 'success'
            });
        }
    });
}

function clearRecursoForm() {
    document.getElementById('recurso-nombre').value = '';
    document.getElementById('recurso-descripcion').value = '';
    document.getElementById('recurso-unidad').value = '';
    document.getElementById('file-input').value = '';
    uploadedFiles = [];
}

console.log('✅ Gestión de Recursos - Cargado');

// ============================================================================
// SECCIÓN 9: PLANIFICACIÓN
// ============================================================================

function generatePlanificacion() {
    const unitId = parseInt(document.getElementById('planificacion-unit').value);
    if (!unitId) {
        showToast({
            title: 'Seleccione una unidad',
            description: 'Debe seleccionar una unidad para generar la planificación.',
            variant: 'warning'
        });
        return;
    }

    const unit = appState.units.find(u => u.id === unitId);
    const objetivos = appState.savedObjectives.filter(o => o.unitId === unitId);
    const experiencias = appState.savedExperiences.filter(e => e.unitId === unitId);

    if (objetivos.length === 0) {
        showToast({
            title: 'Sin objetivos',
            description: 'Esta unidad no tiene objetivos asociados. Cree objetivos primero.',
            variant: 'warning'
        });
        return;
    }

    // Planificación mensual
    const mensualGrid = document.getElementById('planificacion-mensual-grid');
    mensualGrid.innerHTML = `
        <div class="mes-card">
            <h5>${unit.name}</h5>
            <ul>
                <li>${objetivos.length} objetivo(s)</li>
                <li>${experiencias.length} experiencia(s)</li>
                <li>Fechas: ${formatearFecha(unit.fechaInicio)} - ${formatearFecha(unit.fechaFin)}</li>
            </ul>
        </div>
    `;

    // Planificación semanal
    const semanalGrid = document.getElementById('planificacion-semanal-grid');
    const numSemanas = Math.ceil((new Date(unit.fechaFin) - new Date(unit.fechaInicio)) / (7 * 24 * 60 * 60 * 1000));

    semanalGrid.innerHTML = Array.from({length: Math.min(numSemanas, 6)}, (_, i) => `
        <div class="semana-card">
            <h5>Semana ${i + 1}</h5>
            <ul>
                <li>Objetivos: Revisar indicadores</li>
                <li>Experiencias: Implementar actividades</li>
                <li>Evaluación: Registro continuo</li>
            </ul>
        </div>
    `).join('');

    document.getElementById('planificacion-container').style.display = 'block';

    showToast({
        title: 'Planificación generada',
        description: `Planificación para "${unit.name}" lista.`,
        variant: 'success'
    });
}

console.log('✅ Planificación - Cargado');

// ============================================================================
// SECCIÓN 10: REGISTRO DE INDICADORES
// ============================================================================

function handleRegistroUnitChange(e) {
    const unitId = parseInt(e.target.value);
    const objSelect = document.getElementById('registro-objective');

    if (!unitId) {
        objSelect.innerHTML = '<option value="">Seleccione un objetivo...</option>';
        document.getElementById('registro-table-container').style.display = 'none';
        return;
    }

    const objectives = appState.savedObjectives.filter(obj => obj.unitId === unitId);
    objSelect.innerHTML = '<option value="">Seleccione un objetivo...</option>' +
        objectives.map(obj => `<option value="${obj.id}">${obj.specificObjective}</option>`).join('');
}

function handleRegistroObjectiveChange(e) {
    const objectiveId = parseInt(e.target.value);
    const indSelect = document.getElementById('registro-indicator');

    if (!objectiveId) {
        indSelect.innerHTML = '<option value="">Seleccione un indicador...</option>';
        document.getElementById('registro-table-container').style.display = 'none';
        return;
    }

    const objective = appState.savedObjectives.find(obj => obj.id === objectiveId);
    indSelect.innerHTML = '<option value="">Seleccione un indicador...</option>' +
        objective.indicators.map((ind, index) =>
            `<option value="${index}">${ind.text}</option>`
        ).join('');
}

function handleRegistroIndicatorChange(e) {
    if (e.target.value === '') {
        document.getElementById('registro-table-container').style.display = 'none';
        return;
    }

    renderRegistroTable();
}

function renderRegistroTable() {
    const tbody = document.getElementById('registro-tbody');
    const unitId = parseInt(document.getElementById('registro-unit').value);
    const objectiveId = parseInt(document.getElementById('registro-objective').value);
    const indicatorIndex = parseInt(document.getElementById('registro-indicator').value);

    tbody.innerHTML = ESTUDIANTES.map((student, index) => {
        const existing = appState.evaluaciones.find(ev =>
            ev.unitId === unitId && ev.objectiveId === objectiveId &&
            ev.indicatorId === indicatorIndex && ev.studentId === student.id
        );

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${student.nombre}</td>
                <td>
                    <select id="eval-${student.id}" data-student="${student.id}">
                        <option value="">Sin evaluar</option>
                        <option value="logrado" ${existing?.evaluation === 'logrado' ? 'selected' : ''}>Logrado</option>
                        <option value="en-proceso" ${existing?.evaluation === 'en-proceso' ? 'selected' : ''}>En Proceso</option>
                        <option value="no-logrado" ${existing?.evaluation === 'no-logrado' ? 'selected' : ''}>No Logrado</option>
                    </select>
                </td>
                <td>
                    <input type="text" id="obs-${student.id}" value="${existing?.observacion || ''}" placeholder="Observaciones...">
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('registro-table-container').style.display = 'block';
}

function saveEvaluaciones() {
    const unitId = parseInt(document.getElementById('registro-unit').value);
    const objectiveId = parseInt(document.getElementById('registro-objective').value);
    const indicatorIndex = parseInt(document.getElementById('registro-indicator').value);

    let count = 0;
    ESTUDIANTES.forEach(student => {
        const evaluation = document.getElementById(`eval-${student.id}`).value;
        const observacion = document.getElementById(`obs-${student.id}`).value;

        appState.evaluaciones = appState.evaluaciones.filter(ev =>
            !(ev.unitId === unitId && ev.objectiveId === objectiveId &&
              ev.indicatorId === indicatorIndex && ev.studentId === student.id)
        );

        if (evaluation) {
            appState.evaluaciones.push({
                unitId, objectiveId, indicatorId: indicatorIndex,
                studentId: student.id, evaluation, observacion
            });
            count++;
        }
    });

    showToast({
        title: 'Evaluaciones guardadas',
        description: `${count} evaluaciones guardadas correctamente.`,
        variant: 'success'
    });
}

console.log('✅ Registro de Indicadores - Cargado');

// ============================================================================
// SECCIÓN 11: REPORTES
// ============================================================================

function switchReport(reportType) {
    document.querySelectorAll('.report-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.report-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-report="${reportType}"]`).classList.add('active');
    document.getElementById(`report-${reportType}`).classList.add('active');

    if (reportType === 'curso') generateCursoReport();
    else if (reportType === 'estudiante') generateEstudianteReport();
    else if (reportType === 'semestre') return;
    else if (reportType === 'docente') generateDocenteReport();
}

function generateCursoReport() {
    const unitFilter = document.getElementById('report-curso-unit').value;
    const statsContainer = document.getElementById('curso-stats');
    const chartContainer = document.getElementById('curso-chart');

    let evaluaciones = appState.evaluaciones;
    if (unitFilter) evaluaciones = evaluaciones.filter(ev => ev.unitId == unitFilter);

    if (evaluaciones.length === 0) {
        statsContainer.innerHTML = '<p class="help-text">No hay evaluaciones.</p>';
        chartContainer.innerHTML = '';
        return;
    }

    const total = evaluaciones.length;
    const logrado = evaluaciones.filter(ev => ev.evaluation === 'logrado').length;
    const enProceso = evaluaciones.filter(ev => ev.evaluation === 'en-proceso').length;
    const noLogrado = evaluaciones.filter(ev => ev.evaluation === 'no-logrado').length;

    const pctLogrado = ((logrado / total) * 100).toFixed(1);
    const pctProceso = ((enProceso / total) * 100).toFixed(1);
    const pctNoLogrado = ((noLogrado / total) * 100).toFixed(1);

    statsContainer.innerHTML = `
        <div class="stat-card success"><h4>Logrado</h4><div class="stat-value">${logrado}</div><div class="stat-label">${pctLogrado}%</div></div>
        <div class="stat-card warning"><h4>En Proceso</h4><div class="stat-value">${enProceso}</div><div class="stat-label">${pctProceso}%</div></div>
        <div class="stat-card danger"><h4>No Logrado</h4><div class="stat-value">${noLogrado}</div><div class="stat-label">${pctNoLogrado}%</div></div>
        <div class="stat-card"><h4>Total</h4><div class="stat-value">${total}</div><div class="stat-label">Evaluaciones</div></div>
    `;

    chartContainer.innerHTML = `
        <h3>Distribución</h3>
        ${createBar('Logrado', logrado, pctLogrado, 'logrado')}
        ${createBar('En Proceso', enProceso, pctProceso, 'en-proceso')}
        ${createBar('No Logrado', noLogrado, pctNoLogrado, 'no-logrado')}
    `;
}

function createBar(label, value, pct, cls) {
    return `
        <div class="chart-bar">
            <div class="chart-bar-label"><span>${label}</span><span>${value} (${pct}%)</span></div>
            <div class="chart-bar-track"><div class="chart-bar-fill ${cls}" style="width:${pct}%">${pct}%</div></div>
        </div>
    `;
}

function generateEstudianteReport() {
    const studentId = parseInt(document.getElementById('report-student-select').value);
    const statsContainer = document.getElementById('estudiante-stats');
    const chartContainer = document.getElementById('estudiante-chart');

    if (!studentId) {
        statsContainer.innerHTML = '<p class="help-text">Seleccione un estudiante.</p>';
        chartContainer.innerHTML = '';
        return;
    }

    const student = ESTUDIANTES.find(s => s.id === studentId);
    const evaluaciones = appState.evaluaciones.filter(ev => ev.studentId === studentId);

    if (evaluaciones.length === 0) {
        statsContainer.innerHTML = '<p class="help-text">Sin evaluaciones.</p>';
        chartContainer.innerHTML = '';
        return;
    }

    const total = evaluaciones.length;
    const logrado = evaluaciones.filter(ev => ev.evaluation === 'logrado').length;
    const enProceso = evaluaciones.filter(ev => ev.evaluation === 'en-proceso').length;
    const noLogrado = evaluaciones.filter(ev => ev.evaluation === 'no-logrado').length;

    const pctLogrado = ((logrado / total) * 100).toFixed(1);
    const pctProceso = ((enProceso / total) * 100).toFixed(1);
    const pctNoLogrado = ((noLogrado / total) * 100).toFixed(1);

    statsContainer.innerHTML = `
        <div class="stat-card"><h4>Estudiante</h4><div class="stat-value" style="font-size:20px;">${student.nombre}</div><div class="stat-label">${student.rut}</div></div>
        <div class="stat-card success"><h4>Logrado</h4><div class="stat-value">${logrado}</div><div class="stat-label">${pctLogrado}%</div></div>
        <div class="stat-card warning"><h4>En Proceso</h4><div class="stat-value">${enProceso}</div><div class="stat-label">${pctProceso}%</div></div>
        <div class="stat-card danger"><h4>No Logrado</h4><div class="stat-value">${noLogrado}</div><div class="stat-label">${pctNoLogrado}%</div></div>
    `;

    chartContainer.innerHTML = `
        <h3>Progreso de ${student.nombre}</h3>
        ${createBar('Logrado', logrado, pctLogrado, 'logrado')}
        ${createBar('En Proceso', enProceso, pctProceso, 'en-proceso')}
        ${createBar('No Logrado', noLogrado, pctNoLogrado, 'no-logrado')}
    `;
}

function generateReporteSemestre() {
    const semestre = parseInt(document.getElementById('report-semestre-select').value);
    const container = document.getElementById('semestre-report-content');

    const unitsInSemestre = appState.units.filter(u => u.semester === semestre);
    const objsInSemestre = appState.savedObjectives.filter(obj =>
        unitsInSemestre.some(u => u.id === obj.unitId)
    );

    if (objsInSemestre.length === 0) {
        container.innerHTML = '<p class="help-text">No hay objetivos en este semestre.</p>';
        return;
    }

    const nucleos = {};
    objsInSemestre.forEach(obj => {
        if (!nucleos[obj.nucleo]) nucleos[obj.nucleo] = 0;
        nucleos[obj.nucleo]++;
    });

    container.innerHTML = `
        <div class="objetivos-resumen">
            ${Object.entries(nucleos).map(([nucleo, cant]) => `
                <div class="objetivo-resumen-card">
                    <h5>${nucleo}</h5>
                    <div class="stat-value">${cant}</div>
                    <div class="stat-label">Objetivos</div>
                </div>
            `).join('')}
        </div>
        <h4>Total: ${objsInSemestre.length} objetivos en ${unitsInSemestre.length} unidades</h4>
    `;
}

function generateDocenteReport() {
    const statsContainer = document.getElementById('docente-stats');
    const detailsContainer = document.getElementById('docente-details');

    const totalObjetivos = appState.savedObjectives.length;
    const totalExperiencias = appState.savedExperiences.length;
    const totalEvaluaciones = appState.evaluaciones.length;
    const totalEstudiantes = ESTUDIANTES.length;

    const promedioPorEstudiante = (totalEvaluaciones / totalEstudiantes).toFixed(1);

    statsContainer.innerHTML = `
        <div class="stat-card"><h4>Objetivos</h4><div class="stat-value">${totalObjetivos}</div></div>
        <div class="stat-card"><h4>Experiencias</h4><div class="stat-value">${totalExperiencias}</div></div>
        <div class="stat-card"><h4>Evaluaciones</h4><div class="stat-value">${totalEvaluaciones}</div></div>
        <div class="stat-card"><h4>Promedio</h4><div class="stat-value">${promedioPorEstudiante}</div><div class="stat-label">por estudiante</div></div>
    `;

    const nucleos = {};
    appState.savedObjectives.forEach(obj => {
        if (!nucleos[obj.nucleo]) nucleos[obj.nucleo] = 0;
        nucleos[obj.nucleo]++;
    });

    detailsContainer.innerHTML = '<h3>Objetivos por Núcleo</h3><div class="stats-container">' +
        Object.entries(nucleos).map(([nucleo, cant]) => `
            <div class="stat-card"><h4>${nucleo}</h4><div class="stat-value">${cant}</div><div class="stat-label">Objetivos</div></div>
        `).join('') + '</div>';
}

function loadStudentsForReport() {
    const select = document.getElementById('report-student-select');
    select.innerHTML = '<option value="">Seleccione un estudiante...</option>' +
        ESTUDIANTES.map(student => `<option value="${student.id}">${student.nombre}</option>`).join('');
}

console.log('✅ Reportes - Cargado');

// ============================================================================
// SECCIÓN 12: TABS Y MODALES
// ============================================================================

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if (tabName === 'experiencias') loadObjectivesForExperiences();
    else if (tabName === 'recursos') renderRecursos();
    else if (tabName === 'reportes') {
        loadStudentsForReport();
        generateDocenteReport();
        generateCursoReport();
    }
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
}

console.log('✅ Tabs y Modales - Cargado');

// ============================================================================
// SECCIÓN 13: EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Año y Semestre
    document.getElementById('year-select').addEventListener('change', (e) => {
        appState.currentYear = parseInt(e.target.value);
        renderUnits();
    });

    document.getElementById('semester-select').addEventListener('change', (e) => {
        appState.currentSemestre = parseInt(e.target.value);
        renderUnits();
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Stepper Navigation
    document.getElementById('next-step-btn').addEventListener('click', nextStep);
    document.getElementById('prev-step-btn').addEventListener('click', prevStep);
    document.getElementById('save-objective-btn').addEventListener('click', saveObjective);
    document.getElementById('cancel-objective-btn').addEventListener('click', clearObjectiveForm);

    // Objetivos
    document.getElementById('ambito-select').addEventListener('change', handleAmbitoChange);
    document.getElementById('nucleo-select').addEventListener('change', handleNucleoChange);
    document.getElementById('add-indicator-btn').addEventListener('click', addCustomIndicator);

    // Experiencias
    document.getElementById('load-from-bank-btn').addEventListener('click', openBankModal);
    document.getElementById('add-material-btn').addEventListener('click', addMaterial);
    document.getElementById('save-experience-btn').addEventListener('click', saveExperience);
    document.getElementById('clear-experience-btn').addEventListener('click', clearExperienceForm);

    // Recursos
    setupFileUpload();
    document.getElementById('save-recurso-btn').addEventListener('click', saveRecurso);

    // Planificación
    document.getElementById('generar-planificacion-btn').addEventListener('click', generatePlanificacion);

    // Registro
    document.getElementById('registro-unit').addEventListener('change', handleRegistroUnitChange);
    document.getElementById('registro-objective').addEventListener('change', handleRegistroObjectiveChange);
    document.getElementById('registro-indicator').addEventListener('change', handleRegistroIndicatorChange);
    document.getElementById('save-registro-btn').addEventListener('click', saveEvaluaciones);

    // Reportes
    document.querySelectorAll('.report-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchReport(e.target.dataset.report));
    });

    document.getElementById('report-curso-unit').addEventListener('change', generateCursoReport);
    document.getElementById('report-student-select').addEventListener('change', generateEstudianteReport);
    document.getElementById('generar-reporte-semestre-btn').addEventListener('click', generateReporteSemestre);

    // Unidades
    document.getElementById('add-unit-btn').addEventListener('click', openUnitModal);
    document.getElementById('save-unit-btn').addEventListener('click', saveNewUnit);

    // Modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) closeModals();
    });
}

console.log('✅ Event Listeners - Configurados');

// ============================================================================
// FIN DEL SISTEMA - TODO LISTO
// ============================================================================

console.log('✅✅✅ Sistema Completo - Listo para usar');
