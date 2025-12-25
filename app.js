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
    specificObjective: '',
    indicators: [],
    savedObjectives: [],
    savedExperiences: [],
    evaluaciones: [] // { unitId, objectiveId, indicatorId, studentId, evaluation, observacion }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDefaultUnits();
});

function initializeApp() {
    console.log('Sistema de Gestión Pedagógica - Inicializado');
}

// Cargar unidades predeterminadas
function loadDefaultUnits() {
    const defaultUnits = [
        { id: 1, name: 'Los seres vivos', description: 'Exploración y conocimiento de plantas y animales', semester: 1 },
        { id: 2, name: 'Mi familia y comunidad', description: 'Conociendo nuestro entorno social cercano', semester: 1 },
        { id: 3, name: 'Los oficios y profesiones', description: 'Descubriendo el mundo del trabajo', semester: 1 },
        { id: 4, name: 'Las estaciones del año', description: 'Cambios en la naturaleza y el tiempo', semester: 1 },
        { id: 5, name: 'Medios de transporte', description: 'Cómo nos movemos en nuestra ciudad', semester: 2 },
        { id: 6, name: 'El universo y los planetas', description: 'Explorando el espacio', semester: 2 },
        { id: 7, name: 'Cultura y tradiciones chilenas', description: 'Conociendo nuestras raíces', semester: 2 },
        { id: 8, name: 'Alimentación saludable', description: 'Cuidando nuestro cuerpo', semester: 2 }
    ];

    appState.units = defaultUnits;
    renderUnits();
}

// Event Listeners
function setupEventListeners() {
    // Año y semestre
    document.getElementById('year-select').addEventListener('change', (e) => {
        appState.currentYear = parseInt(e.target.value);
        renderUnits();
    });

    document.getElementById('semester-select').addEventListener('change', (e) => {
        appState.currentSemester = parseInt(e.target.value);
        renderUnits();
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // Ámbito y núcleo
    document.getElementById('ambito-select').addEventListener('change', handleAmbitoChange);
    document.getElementById('nucleo-select').addEventListener('change', handleNucleoChange);

    // Botones de objetivos
    document.getElementById('add-indicator-btn').addEventListener('click', addCustomIndicator);
    document.getElementById('save-objective-btn').addEventListener('click', saveObjective);
    document.getElementById('clear-objective-btn').addEventListener('click', clearObjectiveForm);

    // Experiencias
    document.getElementById('load-from-bank-btn').addEventListener('click', openBankModal);
    document.getElementById('save-experience-btn').addEventListener('click', saveExperience);
    document.getElementById('clear-experience-btn').addEventListener('click', clearExperienceForm);

    // Registro
    document.getElementById('registro-unit').addEventListener('change', handleRegistroUnitChange);
    document.getElementById('registro-objective').addEventListener('change', handleRegistroObjectiveChange);
    document.getElementById('registro-indicator').addEventListener('change', handleRegistroIndicatorChange);
    document.getElementById('save-registro-btn').addEventListener('click', saveEvaluaciones);

    // Reportes
    document.querySelectorAll('.report-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchReport(e.target.dataset.report);
        });
    });

    document.getElementById('report-curso-unit').addEventListener('change', generateCursoReport);
    document.getElementById('report-student-select').addEventListener('change', generateEstudianteReport);

    // Modales
    document.getElementById('add-unit-btn').addEventListener('click', openUnitModal);
    document.getElementById('save-unit-btn').addEventListener('click', saveNewUnit);

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

// Renderizar unidades pedagógicas
function renderUnits() {
    const container = document.getElementById('units-container');
    const filteredUnits = appState.units.filter(u => u.semester === appState.currentSemester);

    container.innerHTML = filteredUnits.map(unit => `
        <div class="unit-card ${appState.selectedUnit === unit.id ? 'active' : ''}" onclick="selectUnit(${unit.id})">
            <div class="unit-badge">Unidad ${unit.id}</div>
            <h3>${unit.name}</h3>
            <p>${unit.description}</p>
        </div>
    `).join('');

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

    document.getElementById('experience-unit').innerHTML =
        '<option value="">Seleccione una unidad...</option>' + options;
    document.getElementById('registro-unit').innerHTML =
        '<option value="">Seleccione una unidad...</option>' + options;
    document.getElementById('report-curso-unit').innerHTML =
        '<option value="">Todas las unidades</option>' + options;
}

// Switch entre tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Cargar datos específicos de cada tab
    if (tabName === 'experiencias') {
        loadObjectivesForExperiences();
    } else if (tabName === 'reportes') {
        loadStudentsForReport();
        generateDocenteReport();
        generateCursoReport();
    }
}

// Manejo de Ámbito y Núcleo
function handleAmbitoChange(e) {
    const ambitoKey = e.target.value;
    appState.selectedAmbito = ambitoKey;
    appState.selectedNucleo = null;
    appState.selectedOAs = [];
    appState.selectedOATs = [];

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

function handleNucleoChange(e) {
    const nucleoKey = e.target.value;
    appState.selectedNucleo = nucleoKey;

    if (!nucleoKey) {
        hideObjectiveSections();
        return;
    }

    loadObjectives();
}

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

    // Mostrar OATs
    const oatSection = document.getElementById('oat-section');
    const oatList = document.getElementById('oat-list');

    oatList.innerHTML = OAT.map((oat, index) => `
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

function handleOAChange() {
    appState.selectedOAs = Array.from(document.querySelectorAll('#oa-list input:checked'))
        .map(input => parseInt(input.value));

    checkIfCanCreateSpecific();
}

function handleOATChange() {
    appState.selectedOATs = Array.from(document.querySelectorAll('#oat-list input:checked'))
        .map(input => parseInt(input.value));

    checkIfCanCreateSpecific();
}

function checkIfCanCreateSpecific() {
    if (appState.selectedOAs.length > 0 && appState.selectedOATs.length > 0) {
        document.getElementById('specific-section').style.display = 'block';

        // Evento para textarea de objetivo específico
        document.getElementById('specific-objective-text').oninput = function(e) {
            appState.specificObjective = e.target.value;
            if (e.target.value.trim()) {
                loadSuggestedIndicators();
            }
        };
    } else {
        document.getElementById('specific-section').style.display = 'none';
        document.getElementById('indicators-section').style.display = 'none';
        document.getElementById('save-objective-section').style.display = 'none';
    }
}

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

    const objective = {
        id: Date.now(),
        unitId: appState.selectedUnit,
        ambito: ambito.nombre,
        nucleo: nucleo.nombre,
        nucleoKey: appState.selectedNucleo,
        oas: appState.selectedOAs.map(i => nucleo.oa[i]),
        oats: appState.selectedOATs.map(i => OAT[i]),
        specificObjective: appState.specificObjective,
        indicators: appState.indicators.filter(i => i.text.trim())
    };

    appState.savedObjectives.push(objective);

    alert('Objetivo guardado exitosamente.');
    clearObjectiveForm();
    renderSavedObjectives();
}

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

function viewObjectiveDetails(objId) {
    const obj = appState.savedObjectives.find(o => o.id === objId);
    if (!obj) return;

    let details = `OBJETIVO ESPECÍFICO:\n${obj.specificObjective}\n\n`;
    details += `OBJETIVOS DE APRENDIZAJE (OA):\n`;
    obj.oas.forEach(oa => details += `- ${oa.codigo}: ${oa.texto}\n`);
    details += `\nOBJETIVOS TRANSVERSALES (OAT):\n`;
    obj.oats.forEach(oat => details += `- ${oat.codigo}: ${oat.texto}\n`);
    details += `\nINDICADORES:\n`;
    obj.indicators.forEach((ind, i) => details += `${i+1}. ${ind.text}\n`);

    alert(details);
}

function deleteObjective(objId) {
    if (confirm('¿Está seguro de eliminar este objetivo?')) {
        appState.savedObjectives = appState.savedObjectives.filter(o => o.id !== objId);
        renderSavedObjectives();
    }
}

function clearObjectiveForm() {
    document.getElementById('ambito-select').value = '';
    document.getElementById('nucleo-select').value = '';
    document.getElementById('nucleo-select').disabled = true;
    document.getElementById('specific-objective-text').value = '';

    appState.selectedAmbito = null;
    appState.selectedNucleo = null;
    appState.selectedOAs = [];
    appState.selectedOATs = [];
    appState.specificObjective = '';
    appState.indicators = [];

    hideObjectiveSections();
}

function hideObjectiveSections() {
    document.getElementById('oa-section').style.display = 'none';
    document.getElementById('oat-section').style.display = 'none';
    document.getElementById('specific-section').style.display = 'none';
    document.getElementById('indicators-section').style.display = 'none';
    document.getElementById('save-objective-section').style.display = 'none';
}

// Experiencias de Aprendizaje
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
    alert(`Experiencia "${exp.titulo}" cargada. Puede modificarla según sus necesidades.`);
}

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
        cierre
    };

    appState.savedExperiences.push(experience);

    alert('Experiencia de aprendizaje guardada exitosamente.');
    clearExperienceForm();
    renderSavedExperiences();
}

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
            <div class="item-actions">
                <button class="btn btn-info" onclick="viewExperienceDetails(${exp.id})">Ver Detalles</button>
                <button class="btn btn-danger" onclick="deleteExperience(${exp.id})">Eliminar</button>
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
    details += `CIERRE:\n${exp.cierre}`;

    alert(details);
}

function deleteExperience(expId) {
    if (confirm('¿Está seguro de eliminar esta experiencia?')) {
        appState.savedExperiences = appState.savedExperiences.filter(e => e.id !== expId);
        renderSavedExperiences();
    }
}

function clearExperienceForm() {
    document.getElementById('objective-for-experience').value = '';
    document.getElementById('experience-unit').value = '';
    document.getElementById('experience-inicio').value = '';
    document.getElementById('experience-desarrollo').value = '';
    document.getElementById('experience-cierre').value = '';
}

// Registro de Indicadores
function handleRegistroUnitChange(e) {
    const unitId = parseInt(e.target.value);

    if (!unitId) {
        document.getElementById('registro-objective').innerHTML =
            '<option value="">Seleccione un objetivo...</option>';
        document.getElementById('registro-table-container').style.display = 'none';
        return;
    }

    const objectives = appState.savedObjectives.filter(obj => obj.unitId === unitId);

    document.getElementById('registro-objective').innerHTML =
        '<option value="">Seleccione un objetivo...</option>' +
        objectives.map(obj =>
            `<option value="${obj.id}">${obj.specificObjective}</option>`
        ).join('');
}

function handleRegistroObjectiveChange(e) {
    const objectiveId = parseInt(e.target.value);

    if (!objectiveId) {
        document.getElementById('registro-indicator').innerHTML =
            '<option value="">Seleccione un indicador...</option>';
        document.getElementById('registro-table-container').style.display = 'none';
        return;
    }

    const objective = appState.savedObjectives.find(obj => obj.id === objectiveId);

    document.getElementById('registro-indicator').innerHTML =
        '<option value="">Seleccione un indicador...</option>' +
        objective.indicators.map((ind, index) =>
            `<option value="${index}">${ind.text}</option>`
        ).join('');
}

function handleRegistroIndicatorChange(e) {
    const indicatorIndex = e.target.value;

    if (indicatorIndex === '') {
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
        // Buscar evaluación existente
        const existing = appState.evaluaciones.find(ev =>
            ev.unitId === unitId &&
            ev.objectiveId === objectiveId &&
            ev.indicatorId === indicatorIndex &&
            ev.studentId === student.id
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
                    <input type="text" id="obs-${student.id}"
                           value="${existing?.observacion || ''}"
                           placeholder="Observaciones...">
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

        // Eliminar evaluación previa si existe
        appState.evaluaciones = appState.evaluaciones.filter(ev =>
            !(ev.unitId === unitId &&
              ev.objectiveId === objectiveId &&
              ev.indicatorId === indicatorIndex &&
              ev.studentId === student.id)
        );

        // Agregar nueva evaluación
        if (evaluation) {
            appState.evaluaciones.push({
                unitId,
                objectiveId,
                indicatorId: indicatorIndex,
                studentId: student.id,
                evaluation,
                observacion
            });
        }
    });

    alert('Evaluaciones guardadas exitosamente.');
}

// Reportes
function switchReport(reportType) {
    document.querySelectorAll('.report-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.report-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-report="${reportType}"]`).classList.add('active');
    document.getElementById(`report-${reportType}`).classList.add('active');

    if (reportType === 'curso') {
        generateCursoReport();
    } else if (reportType === 'estudiante') {
        generateEstudianteReport();
    } else if (reportType === 'docente') {
        generateDocenteReport();
    }
}

function loadStudentsForReport() {
    const select = document.getElementById('report-student-select');
    select.innerHTML = '<option value="">Seleccione un estudiante...</option>' +
        ESTUDIANTES.map(student =>
            `<option value="${student.id}">${student.nombre}</option>`
        ).join('');
}

function generateCursoReport() {
    const unitFilter = document.getElementById('report-curso-unit').value;
    const statsContainer = document.getElementById('curso-stats');
    const chartContainer = document.getElementById('curso-chart');

    let evaluaciones = appState.evaluaciones;
    if (unitFilter) {
        evaluaciones = evaluaciones.filter(ev => ev.unitId == unitFilter);
    }

    if (evaluaciones.length === 0) {
        statsContainer.innerHTML = '<p class="help-text">No hay evaluaciones registradas aún.</p>';
        chartContainer.innerHTML = '';
        return;
    }

    const total = evaluaciones.length;
    const logrado = evaluaciones.filter(ev => ev.evaluation === 'logrado').length;
    const enProceso = evaluaciones.filter(ev => ev.evaluation === 'en-proceso').length;
    const noLogrado = evaluaciones.filter(ev => ev.evaluation === 'no-logrado').length;

    const porcentajeLogrado = ((logrado / total) * 100).toFixed(1);
    const porcentajeEnProceso = ((enProceso / total) * 100).toFixed(1);
    const porcentajeNoLogrado = ((noLogrado / total) * 100).toFixed(1);

    statsContainer.innerHTML = `
        <div class="stat-card success">
            <h4>Logrado</h4>
            <div class="stat-value">${logrado}</div>
            <div class="stat-label">${porcentajeLogrado}%</div>
        </div>
        <div class="stat-card warning">
            <h4>En Proceso</h4>
            <div class="stat-value">${enProceso}</div>
            <div class="stat-label">${porcentajeEnProceso}%</div>
        </div>
        <div class="stat-card danger">
            <h4>No Logrado</h4>
            <div class="stat-value">${noLogrado}</div>
            <div class="stat-label">${porcentajeNoLogrado}%</div>
        </div>
        <div class="stat-card">
            <h4>Total Evaluaciones</h4>
            <div class="stat-value">${total}</div>
            <div class="stat-label">Registros</div>
        </div>
    `;

    chartContainer.innerHTML = `
        <h3>Distribución de Evaluaciones</h3>
        <div class="chart-bar">
            <div class="chart-bar-label">
                <span>Logrado</span>
                <span>${logrado} (${porcentajeLogrado}%)</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill logrado" style="width: ${porcentajeLogrado}%">
                    ${porcentajeLogrado}%
                </div>
            </div>
        </div>
        <div class="chart-bar">
            <div class="chart-bar-label">
                <span>En Proceso</span>
                <span>${enProceso} (${porcentajeEnProceso}%)</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill en-proceso" style="width: ${porcentajeEnProceso}%">
                    ${porcentajeEnProceso}%
                </div>
            </div>
        </div>
        <div class="chart-bar">
            <div class="chart-bar-label">
                <span>No Logrado</span>
                <span>${noLogrado} (${porcentajeNoLogrado}%)</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill no-logrado" style="width: ${porcentajeNoLogrado}%">
                    ${porcentajeNoLogrado}%
                </div>
            </div>
        </div>
    `;
}

function generateEstudianteReport() {
    const studentId = parseInt(document.getElementById('report-student-select').value);
    const statsContainer = document.getElementById('estudiante-stats');
    const chartContainer = document.getElementById('estudiante-chart');

    if (!studentId) {
        statsContainer.innerHTML = '<p class="help-text">Seleccione un estudiante para ver su reporte.</p>';
        chartContainer.innerHTML = '';
        return;
    }

    const student = ESTUDIANTES.find(s => s.id === studentId);
    const evaluaciones = appState.evaluaciones.filter(ev => ev.studentId === studentId);

    if (evaluaciones.length === 0) {
        statsContainer.innerHTML = '<p class="help-text">Este estudiante no tiene evaluaciones registradas.</p>';
        chartContainer.innerHTML = '';
        return;
    }

    const total = evaluaciones.length;
    const logrado = evaluaciones.filter(ev => ev.evaluation === 'logrado').length;
    const enProceso = evaluaciones.filter(ev => ev.evaluation === 'en-proceso').length;
    const noLogrado = evaluaciones.filter(ev => ev.evaluation === 'no-logrado').length;

    const porcentajeLogrado = ((logrado / total) * 100).toFixed(1);
    const porcentajeEnProceso = ((enProceso / total) * 100).toFixed(1);
    const porcentajeNoLogrado = ((noLogrado / total) * 100).toFixed(1);

    statsContainer.innerHTML = `
        <div class="stat-card">
            <h4>Estudiante</h4>
            <div class="stat-value" style="font-size: 20px;">${student.nombre}</div>
            <div class="stat-label">${student.rut}</div>
        </div>
        <div class="stat-card success">
            <h4>Logrado</h4>
            <div class="stat-value">${logrado}</div>
            <div class="stat-label">${porcentajeLogrado}%</div>
        </div>
        <div class="stat-card warning">
            <h4>En Proceso</h4>
            <div class="stat-value">${enProceso}</div>
            <div class="stat-label">${porcentajeEnProceso}%</div>
        </div>
        <div class="stat-card danger">
            <h4>No Logrado</h4>
            <div class="stat-value">${noLogrado}</div>
            <div class="stat-label">${porcentajeNoLogrado}%</div>
        </div>
    `;

    chartContainer.innerHTML = `
        <h3>Progreso de ${student.nombre}</h3>
        <div class="chart-bar">
            <div class="chart-bar-label">
                <span>Logrado</span>
                <span>${logrado} de ${total}</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill logrado" style="width: ${porcentajeLogrado}%">
                    ${porcentajeLogrado}%
                </div>
            </div>
        </div>
        <div class="chart-bar">
            <div class="chart-bar-label">
                <span>En Proceso</span>
                <span>${enProceso} de ${total}</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill en-proceso" style="width: ${porcentajeEnProceso}%">
                    ${porcentajeEnProceso}%
                </div>
            </div>
        </div>
        <div class="chart-bar">
            <div class="chart-bar-label">
                <span>No Logrado</span>
                <span>${noLogrado} de ${total}</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill no-logrado" style="width: ${porcentajeNoLogrado}%">
                    ${porcentajeNoLogrado}%
                </div>
            </div>
        </div>
    `;
}

function generateDocenteReport() {
    const statsContainer = document.getElementById('docente-stats');
    const detailsContainer = document.getElementById('docente-details');

    const totalObjetivos = appState.savedObjectives.length;
    const totalExperiencias = appState.savedExperiences.length;
    const totalEvaluaciones = appState.evaluaciones.length;
    const totalEstudiantes = ESTUDIANTES.length;

    const evaluacionesPorEstudiante = totalEvaluaciones / totalEstudiantes;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <h4>Objetivos Creados</h4>
            <div class="stat-value">${totalObjetivos}</div>
            <div class="stat-label">Total</div>
        </div>
        <div class="stat-card">
            <h4>Experiencias Diseñadas</h4>
            <div class="stat-value">${totalExperiencias}</div>
            <div class="stat-label">Total</div>
        </div>
        <div class="stat-card">
            <h4>Evaluaciones Registradas</h4>
            <div class="stat-value">${totalEvaluaciones}</div>
            <div class="stat-label">Total</div>
        </div>
        <div class="stat-card">
            <h4>Promedio por Estudiante</h4>
            <div class="stat-value">${evaluacionesPorEstudiante.toFixed(1)}</div>
            <div class="stat-label">Evaluaciones</div>
        </div>
    `;

    // Detalle por núcleo
    const objetivosPorNucleo = {};
    appState.savedObjectives.forEach(obj => {
        if (!objetivosPorNucleo[obj.nucleo]) {
            objetivosPorNucleo[obj.nucleo] = 0;
        }
        objetivosPorNucleo[obj.nucleo]++;
    });

    let detalleHTML = '<h3>Objetivos por Núcleo de Aprendizaje</h3>';

    if (Object.keys(objetivosPorNucleo).length > 0) {
        detalleHTML += '<div class="stats-container">';
        for (let [nucleo, cantidad] of Object.entries(objetivosPorNucleo)) {
            detalleHTML += `
                <div class="stat-card">
                    <h4>${nucleo}</h4>
                    <div class="stat-value">${cantidad}</div>
                    <div class="stat-label">Objetivos</div>
                </div>
            `;
        }
        detalleHTML += '</div>';
    } else {
        detalleHTML += '<p class="help-text">No hay objetivos creados aún.</p>';
    }

    detailsContainer.innerHTML = detalleHTML;
}

// Modales
function openUnitModal() {
    document.getElementById('unit-modal').classList.add('active');
    document.getElementById('unit-name').value = '';
    document.getElementById('unit-description').value = '';
}

function saveNewUnit() {
    const name = document.getElementById('unit-name').value.trim();
    const description = document.getElementById('unit-description').value.trim();

    if (!name) {
        alert('Por favor, ingrese el nombre de la unidad.');
        return;
    }

    const newUnit = {
        id: appState.units.length + 1,
        name,
        description: description || 'Sin descripción',
        semester: appState.currentSemester
    };

    appState.units.push(newUnit);
    renderUnits();
    closeModals();
    alert('Unidad pedagógica creada exitosamente.');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Inicializar reportes y render inicial
setTimeout(() => {
    renderSavedObjectives();
    renderSavedExperiences();
}, 100);
