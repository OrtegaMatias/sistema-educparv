// ============================================================================
// SISTEMA DE GESTIÓN PEDAGÓGICA - EDUCACIÓN PARVULARIA
// Nivel Transición - Bases Curriculares 2019
// ============================================================================

// ============================================================================
// SECCIÓN 1: ESTADO GLOBAL E INICIALIZACIÓN
// ============================================================================

// Estado global de la aplicación
const appState = {
    currentYear: 2025,
    currentSemester: 1,
    selectedUnit: null,
    units: [],
    selectedAmbito: null,
    selectedNucleo: null,
    selectedOAs: [],
    selectedOATs: [],
    selectedTercerOA: null, // NUEVO: Tercer objetivo opcional
    specificObjective: '',
    indicators: [],
    savedObjectives: [],
    savedExperiences: [],
    savedRecursos: [], // NUEVO: Recursos y guías
    materiales: [], // NUEVO: Materiales por experiencia
    evaluaciones: [],
    planificaciones: [] // NUEVO: Planificaciones guardadas
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Gestión Pedagógica - Inicializado');
    initializeApp();
    setupEventListeners();
    loadDefaultUnits();
});

function initializeApp() {
    // Inicializar materiales vacíos
    appState.materiales = [];

    // Renderizar componentes iniciales
    renderSavedObjectives();
    renderSavedExperiences();
}

// Cargar unidades predeterminadas con fechas
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
            name: 'Cultura y tradiciones chilenas',
            description: 'Conociendo nuestras raíces',
            semester: 2,
            fechaInicio: '2025-10-27',
            fechaFin: '2025-11-28'
        },
        {
            id: 8,
            name: 'Alimentación saludable',
            description: 'Cuidando nuestro cuerpo',
            semester: 2,
            fechaInicio: '2025-12-01',
            fechaFin: '2025-12-19'
        }
    ];

    appState.units = defaultUnits;
    renderUnits();
}

console.log('✅ Sección 1: Estado Global e Inicialización - Cargado');

// ============================================================================
// FIN SECCIÓN 1
// ============================================================================


// ============================================================================
// SECCIÓN 2: GESTIÓN DE UNIDADES PEDAGÓGICAS (con Fechas y Efemérides)
// ============================================================================

// Renderizar unidades pedagógicas
function renderUnits() {
    const container = document.getElementById('units-container');
    const filteredUnits = appState.units.filter(u => u.semester === appState.currentSemester);

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

    // Actualizar selectores de unidades en otras secciones
    updateUnitSelectors();
}

function selectUnit(unitId) {
    appState.selectedUnit = unitId;
    renderUnits();
}

function updateUnitSelectors() {
    const filteredUnits = appState.units.filter(u => u.semester === appState.currentSemester);
    const options = filteredUnits.map(u =>
        `<option value="${u.id}">${u.name}</option>`
    ).join('');

    // Actualizar todos los selectores de unidades
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

// Formatear fecha para mostrar
function formatearFecha(fechaStr) {
    if (!fechaStr) return 'No definida';
    const fecha = new Date(fechaStr + 'T00:00:00');
    const opciones = { day: '2-digit', month: 'short' };
    return fecha.toLocaleDateString('es-CL', opciones);
}

// Ver efemérides de una unidad
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

// Modal de agregar unidad
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
        alert('Por favor, ingrese el nombre de la unidad.');
        return;
    }

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
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
    renderUnits();
    closeModals();
    alert('Unidad pedagógica creada exitosamente.');
}

console.log('✅ Sección 2: Gestión de Unidades - Cargado');

// ============================================================================
// FIN SECCIÓN 2
// ============================================================================


// ============================================================================
// SECCIÓN 3: GESTIÓN DE OBJETIVOS (OAT por Núcleo + Tercer Objetivo)
// ============================================================================

// Manejo de cambio de ámbito
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
        hideObjectiveSections();
        return;
    }

    const ambito = AMBITOS[ambitoKey];
    const nucleoOptions = Object.keys(ambito.nucleos).map(key => {
        const nucleo = ambito.nucleos[key];
        return `<option value="${key}">${nucleo.nombre}</option>`;
    }).join('');

    nucleoSelect.disabled = false;
    nucleoSelect.innerHTML = '<option value="">Seleccione un núcleo...</option>' + nucleoOptions;
    hideObjectiveSections();
}

// Manejo de cambio de núcleo
function handleNucleoChange(e) {
    const nucleoKey = e.target.value;
    appState.selectedNucleo = nucleoKey;

    if (!nucleoKey) {
        hideObjectiveSections();
        return;
    }

    loadObjectives();
}

// Cargar objetivos del núcleo seleccionado
function loadObjectives() {
    const ambito = AMBITOS[appState.selectedAmbito];
    const nucleo = ambito.nucleos[appState.selectedNucleo];

    // Mostrar OAs
    const oaSection = document.getElementById('oa-section');
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

    oaSection.style.display = 'block';

    // Mostrar OATs específicos del núcleo
    const oatSection = document.getElementById('oat-section');
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

    oatSection.style.display = 'block';
}

// Manejo de cambios en OAs
function handleOAChange() {
    appState.selectedOAs = Array.from(document.querySelectorAll('#oa-list input:checked'))
        .map(input => parseInt(input.value));

    checkIfCanCreateSpecific();
    loadTercerObjetivoOptions();
}

// Manejo de cambios en OATs
function handleOATChange() {
    appState.selectedOATs = Array.from(document.querySelectorAll('#oat-list input:checked'))
        .map(input => parseInt(input.value));

    checkIfCanCreateSpecific();
}

// Verificar si se puede crear objetivo específico
function checkIfCanCreateSpecific() {
    if (appState.selectedOAs.length > 0 && appState.selectedOATs.length > 0) {
        document.getElementById('specific-section').style.display = 'block';
        document.getElementById('tercer-objetivo-section').style.display = 'block';

        // Evento para textarea de objetivo específico
        document.getElementById('specific-objective-text').oninput = function(e) {
            appState.specificObjective = e.target.value;
            if (e.target.value.trim()) {
                loadSuggestedIndicators();
            }
        };
    } else {
        document.getElementById('specific-section').style.display = 'none';
        document.getElementById('tercer-objetivo-section').style.display = 'none';
        document.getElementById('indicators-section').style.display = 'none';
        document.getElementById('save-objective-section').style.display = 'none';
    }
}

// Cargar opciones para tercer objetivo
function loadTercerObjetivoOptions() {
    const tercerSelect = document.getElementById('tercer-oa-select');
    if (!tercerSelect) return;

    const ambito = AMBITOS[appState.selectedAmbito];
    const nucleo = ambito.nucleos[appState.selectedNucleo];

    // Filtrar OAs que no estén ya seleccionados
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

// Cargar indicadores sugeridos
function loadSuggestedIndicators() {
    const indicators = generarIndicadoresSugeridos(appState.selectedNucleo);
    appState.indicators = indicators.map((text, index) => ({
        id: index,
        text: text,
        editable: true
    }));

    renderIndicators();
    document.getElementById('indicators-section').style.display = 'block';
    document.getElementById('save-objective-section').style.display = 'block';
}

// Renderizar indicadores
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

// Guardar objetivo completo
function saveObjective() {
    if (!appState.selectedUnit) {
        alert('Por favor, seleccione una unidad pedagógica primero.');
        return;
    }

    if (!appState.specificObjective.trim()) {
        alert('Por favor, escriba el objetivo específico.');
        return;
    }

    if (appState.indicators.filter(i => i.text.trim()).length === 0) {
        alert('Por favor, agregue al menos un indicador.');
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

    alert('Objetivo guardado exitosamente.');
    clearObjectiveForm();
    renderSavedObjectives();
}

// Renderizar objetivos guardados
function renderSavedObjectives() {
    const container = document.getElementById('saved-objectives-list');

    if (appState.savedObjectives.length === 0) {
        container.innerHTML = '<p class="help-text">No hay objetivos guardados aún.</p>';
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
                    <span class="badge">${obj.oas.length} OA(s)</span>
                    <span class="badge">${obj.oats.length} OAT(s)</span>
                    ${obj.tercerOA ? '<span class="badge badge-info">+ 1 OA Adicional</span>' : ''}
                    <span class="badge">${obj.indicators.length} Indicadores</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-info" onclick="viewObjectiveDetails(${obj.id})">Ver Detalles</button>
                    <button class="btn btn-danger" onclick="deleteObjective(${obj.id})">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

// Ver detalles de un objetivo
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

    alert(details);
}

// Eliminar objetivo
function deleteObjective(objId) {
    if (confirm('¿Está seguro de eliminar este objetivo?')) {
        appState.savedObjectives = appState.savedObjectives.filter(o => o.id !== objId);
        renderSavedObjectives();
    }
}

// Limpiar formulario de objetivos
function clearObjectiveForm() {
    document.getElementById('ambito-select').value = '';
    document.getElementById('nucleo-select').value = '';
    document.getElementById('nucleo-select').disabled = true;
    document.getElementById('specific-objective-text').value = '';
    document.getElementById('tercer-oa-select').value = '';

    appState.selectedAmbito = null;
    appState.selectedNucleo = null;
    appState.selectedOAs = [];
    appState.selectedOATs = [];
    appState.selectedTercerOA = null;
    appState.specificObjective = '';
    appState.indicators = [];

    hideObjectiveSections();
}

// Ocultar secciones de objetivos
function hideObjectiveSections() {
    document.getElementById('oa-section').style.display = 'none';
    document.getElementById('oat-section').style.display = 'none';
    document.getElementById('specific-section').style.display = 'none';
    document.getElementById('tercer-objetivo-section').style.display = 'none';
    document.getElementById('indicators-section').style.display = 'none';
    document.getElementById('save-objective-section').style.display = 'none';
}

console.log('✅ Sección 3: Gestión de Objetivos - Cargado');

// ============================================================================
// FIN SECCIÓN 3
// ============================================================================


// ============================================================================
// SECCIÓN 4: GESTIÓN DE EXPERIENCIAS (con Materiales)
// ============================================================================

// Cargar objetivos para experiencias
function loadObjectivesForExperiences() {
    const select = document.getElementById('objective-for-experience');
    select.innerHTML = '<option value="">Seleccione un objetivo guardado...</option>' +
        appState.savedObjectives.map(obj =>
            `<option value="${obj.id}">${obj.specificObjective}</option>`
        ).join('');
}

// Abrir modal del banco de experiencias
function openBankModal() {
    const modal = document.getElementById('bank-modal');
    modal.classList.add('active');

    // Cargar filtro de núcleos
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

// Renderizar experiencias del banco
function renderBankExperiences(filterNucleo = '') {
    const container = document.getElementById('bank-experiences-list');

    let experiences = BANCO_EXPERIENCIAS;
    if (filterNucleo) {
        experiences = experiences.filter(exp => exp.nucleo === filterNucleo);
    }

    container.innerHTML = experiences.map((exp, index) => `
        <div class="bank-experience-card" onclick="loadExperienceFromBank(${index})">
            <h4>${exp.titulo}</h4>
            <span class="badge">${getNucleoName(exp.nucleo)}</span>
            <p><strong>Inicio:</strong> ${exp.inicio.substring(0, 100)}...</p>
        </div>
    `).join('');
}

// Obtener nombre del núcleo
function getNucleoName(nucleoKey) {
    for (let ambito of Object.values(AMBITOS)) {
        if (ambito.nucleos[nucleoKey]) {
            return ambito.nucleos[nucleoKey].nombre;
        }
    }
    return nucleoKey;
}

// Cargar experiencia desde el banco
function loadExperienceFromBank(index) {
    const exp = BANCO_EXPERIENCIAS[index];

    document.getElementById('experience-inicio').value = exp.inicio;
    document.getElementById('experience-desarrollo').value = exp.desarrollo;
    document.getElementById('experience-cierre').value = exp.cierre;

    closeModals();
    alert(`Experiencia "${exp.titulo}" cargada. Puede modificarla según sus necesidades.`);
}

// Gestión de materiales
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

// Guardar experiencia
function saveExperience() {
    const objectiveId = document.getElementById('objective-for-experience').value;
    const unitId = document.getElementById('experience-unit').value;
    const inicio = document.getElementById('experience-inicio').value;
    const desarrollo = document.getElementById('experience-desarrollo').value;
    const cierre = document.getElementById('experience-cierre').value;

    if (!objectiveId || !unitId) {
        alert('Por favor, seleccione un objetivo y una unidad pedagógica.');
        return;
    }

    if (!inicio.trim() || !desarrollo.trim() || !cierre.trim()) {
        alert('Por favor, complete las tres fases de la experiencia (Inicio, Desarrollo, Cierre).');
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

    alert('Experiencia de aprendizaje guardada exitosamente.');
    clearExperienceForm();
    renderSavedExperiences();
}

// Renderizar experiencias guardadas
function renderSavedExperiences() {
    const container = document.getElementById('saved-experiences-list');

    if (appState.savedExperiences.length === 0) {
        container.innerHTML = '<p class="help-text">No hay experiencias guardadas aún.</p>';
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
                <button class="btn btn-info" onclick="viewExperienceDetails(${exp.id})">Ver Detalles</button>
                <button class="btn btn-danger" onclick="deleteExperience(${exp.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Ver detalles de experiencia
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

    alert(details);
}

// Eliminar experiencia
function deleteExperience(expId) {
    if (confirm('¿Está seguro de eliminar esta experiencia?')) {
        appState.savedExperiences = appState.savedExperiences.filter(e => e.id !== expId);
        renderSavedExperiences();
    }
}

// Limpiar formulario de experiencia
function clearExperienceForm() {
    document.getElementById('objective-for-experience').value = '';
    document.getElementById('experience-unit').value = '';
    document.getElementById('experience-inicio').value = '';
    document.getElementById('experience-desarrollo').value = '';
    document.getElementById('experience-cierre').value = '';
    appState.materiales = [];
    renderMateriales();
}

console.log('✅ Sección 4: Gestión de Experiencias - Cargado');

// ============================================================================
// FIN SECCIÓN 4
// ============================================================================


// ============================================================================
// SECCIÓN 5-9: RECURSOS, PLANIFICACIÓN, REGISTRO, REPORTES, EVENT LISTENERS
// ============================================================================

// GUÍAS Y RECURSOS
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
    alert(`${files.length} archivo(s) seleccionado(s): ${Array.from(files).map(f => f.name).join(', ')}`);
}

function saveRecurso() {
    const nombre = document.getElementById('recurso-nombre').value.trim();
    const descripcion = document.getElementById('recurso-descripcion').value.trim();
    const unitId = document.getElementById('recurso-unidad').value;

    if (!nombre) {
        alert('Ingrese el nombre del recurso.');
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
    alert('Recurso guardado exitosamente.');
}

function renderRecursos() {
    const container = document.getElementById('saved-recursos-list');

    if (appState.savedRecursos.length === 0) {
        container.innerHTML = '<p class="help-text">No hay recursos guardados.</p>';
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
                <button class="btn btn-danger" onclick="deleteRecurso(${rec.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function deleteRecurso(id) {
    if (confirm('¿Eliminar recurso?')) {
        appState.savedRecursos = appState.savedRecursos.filter(r => r.id !== id);
        renderRecursos();
    }
}

function clearRecursoForm() {
    document.getElementById('recurso-nombre').value = '';
    document.getElementById('recurso-descripcion').value = '';
    document.getElementById('recurso-unidad').value = '';
    document.getElementById('file-input').value = '';
    uploadedFiles = [];
}

// PLANIFICACIÓN
function generatePlanificacion() {
    const unitId = parseInt(document.getElementById('planificacion-unit').value);
    if (!unitId) {
        alert('Seleccione una unidad.');
        return;
    }

    const unit = appState.units.find(u => u.id === unitId);
    const objetivos = appState.savedObjectives.filter(o => o.unitId === unitId);
    const experiencias = appState.savedExperiences.filter(e => e.unitId === unitId);

    if (objetivos.length === 0) {
        alert('Esta unidad no tiene objetivos asociados.');
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
}

// REGISTRO DE INDICADORES
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
        }
    });

    alert('Evaluaciones guardadas.');
}

// REPORTES
function switchReport(reportType) {
    document.querySelectorAll('.report-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.report-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-report="${reportType}"]`).classList.add('active');
    document.getElementById(`report-${reportType}`).classList.add('active');

    if (reportType === 'curso') generateCursoReport();
    else if (reportType === 'estudiante') generateEstudianteReport();
    else if (reportType === 'semestre') return; // Se genera con botón
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

// TABS Y MODALES
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

// EVENT LISTENERS COMPLETOS
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

    // Objetivos
    document.getElementById('ambito-select').addEventListener('change', handleAmbitoChange);
    document.getElementById('nucleo-select').addEventListener('change', handleNucleoChange);
    document.getElementById('add-indicator-btn').addEventListener('click', addCustomIndicator);
    document.getElementById('save-objective-btn').addEventListener('click', saveObjective);
    document.getElementById('clear-objective-btn').addEventListener('click', clearObjectiveForm);

    // Experiencias
    document.getElementById('load-from-bank-btn').addEventListener('click', openBankModal);
    document.getElementById('add-material-btn').addEventListener('click', () => {
        addMaterial();
    });
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

console.log('✅ Todas las Secciones Cargadas - Sistema Completoو');

// ============================================================================
// FIN APP.JS
// ============================================================================
