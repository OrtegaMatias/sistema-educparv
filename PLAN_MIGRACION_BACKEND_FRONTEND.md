# Plan de Migración: Backend FastAPI + Frontend React + Docker Compose

## Objetivo General

Migrar el actual sistema de gestión pedagógica para educación parvularia desde una aplicación vanilla JavaScript con localStorage a una arquitectura full-stack moderna con:

- **Backend:** FastAPI (Python) + PostgreSQL + SQLAlchemy
- **Frontend:** React + TypeScript + shadcn/ui
- **Infraestructura:** Docker Compose
- **Autenticación:** JWT multi-usuario con roles (admin/educadora)
- **Almacenamiento:** Local disk (Docker volumes)
- **Estructura:** Monorepo con `/backend` y `/frontend`

---

## Decisiones de Arquitectura (Confirmadas por Usuario)

✅ **Autenticación:** Multi-usuario con login y roles (admin, educadora)
✅ **Base de Datos:** PostgreSQL 15+
✅ **Estructura:** Monorepo (todo junto en /backend y /frontend)
✅ **Archivos:** Disco local con volúmenes Docker

---

## Análisis del Estado Actual

### Data Models Identificados (14+ entidades)

De la exploración del código actual:

1. **Unit** - Unidades pedagógicas
2. **Objective** - Objetivos de aprendizaje específicos
3. **Experience** - Experiencias de aprendizaje
4. **Recurso** - Recursos pedagógicos
5. **Material** - Materiales educativos
6. **Evaluacion** - Evaluaciones
7. **Planificacion** - Planificaciones pedagógicas
8. **Student** - Estudiantes
9. **RegistroAsistencia** - Asistencia diaria
10. **Ambito** - Ámbitos de aprendizaje (DATO ESTÁTICO)
11. **Nucleo** - Núcleos de aprendizaje (DATO ESTÁTICO)
12. **OA** - Objetivos de Aprendizaje curriculares (DATO ESTÁTICO)
13. **OAT** - Objetivos Transversales (DATO ESTÁTICO)
14. **Efemeride** - Fechas del calendario escolar (DATO ESTÁTICO)

### Funcionalidades CRUD Existentes

**Unidades:**
- Crear, editar, eliminar, seleccionar, filtrar por semestre/año

**Objetivos:**
- Crear con wizard de 5 pasos, editar, eliminar, vincular a OA/OAT/núcleo

**Experiencias:**
- Crear, editar, eliminar, vincular a unidades y objetivos, gestionar inicio/desarrollo/cierre

**Recursos:**
- Agregar, editar, eliminar, categorizar (materiales, evaluaciones)

**Estudiantes:**
- Listar, registrar asistencia, guardar evaluaciones por indicador

**Planificación:**
- Generar automáticamente desde unidades/objetivos/experiencias
- Exportar a impresión

**Sistema:**
- Export/Import JSON (backup/restore)
- Clear storage
- localStorage con versionado (v2.0)

---

## Estructura del Monorepo

```
sistema-educparv/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   │
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── unit.py
│   │   │   ├── objective.py
│   │   │   ├── experience.py
│   │   │   ├── recurso.py
│   │   │   ├── student.py
│   │   │   ├── evaluacion.py
│   │   │   ├── planificacion.py
│   │   │   └── reference_data.py  # Ambitos, Nucleos, OA, OAT, Efemerides
│   │   │
│   │   ├── schemas/             # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── auth.py
│   │   │   ├── unit.py
│   │   │   ├── objective.py
│   │   │   ├── experience.py
│   │   │   ├── recurso.py
│   │   │   ├── student.py
│   │   │   ├── evaluacion.py
│   │   │   └── reference_data.py
│   │   │
│   │   ├── routers/             # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # /api/auth (login, register, refresh)
│   │   │   ├── users.py         # /api/users
│   │   │   ├── units.py         # /api/units
│   │   │   ├── objectives.py    # /api/objectives
│   │   │   ├── experiences.py   # /api/experiences
│   │   │   ├── recursos.py      # /api/recursos
│   │   │   ├── students.py      # /api/students
│   │   │   ├── evaluaciones.py  # /api/evaluaciones
│   │   │   ├── planificaciones.py # /api/planificaciones
│   │   │   ├── reference_data.py  # /api/ambitos, /api/nucleos, /api/oas, /api/oats, /api/efemerides
│   │   │   └── import_export.py   # /api/export, /api/import
│   │   │
│   │   ├── services/            # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── unit_service.py
│   │   │   ├── objective_service.py
│   │   │   ├── experience_service.py
│   │   │   ├── planificacion_service.py
│   │   │   └── import_export_service.py
│   │   │
│   │   ├── core/                # Core utilities
│   │   │   ├── __init__.py
│   │   │   ├── security.py      # JWT, password hashing
│   │   │   ├── permissions.py   # RBAC
│   │   │   └── exceptions.py
│   │   │
│   │   └── seed/                # Database seeding
│   │       ├── __init__.py
│   │       ├── seed_reference_data.py
│   │       └── seed_demo_data.py
│   │
│   └── tests/
│       ├── __init__.py
│       ├── test_auth.py
│       ├── test_units.py
│       └── test_objectives.py
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   │
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── vite-env.d.ts
│   │   │
│   │   ├── config/
│   │   │   └── api.ts            # Axios instance with interceptors
│   │   │
│   │   ├── lib/                  # shadcn/ui setup
│   │   │   └── utils.ts
│   │   │
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── stepper.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── TabNavigation.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── RoleGuard.tsx
│   │   │   │
│   │   │   ├── units/
│   │   │   │   ├── UnitCard.tsx
│   │   │   │   ├── UnitList.tsx
│   │   │   │   ├── UnitForm.tsx
│   │   │   │   └── UnitModal.tsx
│   │   │   │
│   │   │   ├── objectives/
│   │   │   │   ├── ObjectiveWizard.tsx      # 5-step stepper
│   │   │   │   ├── ObjectiveCard.tsx
│   │   │   │   ├── ObjectiveList.tsx
│   │   │   │   └── steps/
│   │   │   │       ├── Step1AmbitoNucleo.tsx
│   │   │   │       ├── Step2SelectOAs.tsx
│   │   │   │       ├── Step3SelectOATs.tsx
│   │   │   │       ├── Step4SpecificObjective.tsx
│   │   │   │       └── Step5Review.tsx
│   │   │   │
│   │   │   ├── experiences/
│   │   │   │   ├── ExperienceCard.tsx
│   │   │   │   ├── ExperienceList.tsx
│   │   │   │   ├── ExperienceForm.tsx
│   │   │   │   └── ExperienceModal.tsx
│   │   │   │
│   │   │   ├── planificaciones/
│   │   │   │   ├── PlanificacionTable.tsx
│   │   │   │   ├── PlanificacionPreview.tsx
│   │   │   │   └── PlanificacionExport.tsx
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── StudentTable.tsx
│   │   │   │   └── AsistenciaRegistro.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── EmptyState.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── ConfirmDialog.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useUnits.ts
│   │   │   ├── useObjectives.ts
│   │   │   ├── useExperiences.ts
│   │   │   ├── useReferenceData.ts
│   │   │   └── useToast.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── UnitsPage.tsx
│   │   │   ├── ObjectivesPage.tsx
│   │   │   ├── ExperiencesPage.tsx
│   │   │   ├── PlanificacionesPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   │
│   │   ├── store/                # State management (opcional: usar TanStack Query)
│   │   │   ├── authStore.ts
│   │   │   └── appStore.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── units.ts
│   │   │   │   ├── objectives.ts
│   │   │   │   ├── experiences.ts
│   │   │   │   ├── planificaciones.ts
│   │   │   │   └── referenceData.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── unit.ts
│   │   │   ├── objective.ts
│   │   │   ├── experience.ts
│   │   │   ├── student.ts
│   │   │   └── referenceData.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── styles/
│   │       └── globals.css       # Tailwind + shadcn/ui variables
│   │
│   └── .env.example
│
└── nginx/
    ├── Dockerfile
    └── nginx.conf
```

---

## Base de Datos: Esquema PostgreSQL

### Tablas de Usuarios y Autenticación

#### `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'educadora', -- 'admin' | 'educadora'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Tablas de Datos de Usuario

#### `units`
```sql
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
    fecha_inicio DATE,
    fecha_fin DATE,
    efemerides TEXT[], -- Array de IDs de efemérides (o tabla relacional)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_units_user_id ON units(user_id);
CREATE INDEX idx_units_year_semester ON units(year, semester);
```

#### `objectives`
```sql
CREATE TABLE objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,

    -- Wizard Step 1: Ámbito y Núcleo
    ambito_id VARCHAR(50) NOT NULL,
    nucleo_id VARCHAR(50) NOT NULL,

    -- Wizard Step 2: OAs
    selected_oas TEXT[] NOT NULL, -- Array de OA codes ['OA01', 'OA02']

    -- Wizard Step 3: OATs
    selected_oats TEXT[] NOT NULL, -- Array de OAT IDs

    -- Wizard Step 4: Objetivo específico
    specific_objective TEXT NOT NULL,

    -- Wizard Step 4: Tercer objetivo (opcional)
    tercer_objetivo_oa VARCHAR(50),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_objectives_user_id ON objectives(user_id);
CREATE INDEX idx_objectives_unit_id ON objectives(unit_id);
CREATE INDEX idx_objectives_nucleo_id ON objectives(nucleo_id);
```

#### `objective_indicators`
```sql
CREATE TABLE objective_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    position INTEGER NOT NULL, -- Orden de los indicadores
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_indicators_objective_id ON objective_indicators(objective_id);
```

#### `experiences`
```sql
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    tipo VARCHAR(100), -- Tipo de experiencia
    descripcion TEXT,

    -- Estructura pedagógica
    inicio TEXT NOT NULL,
    desarrollo TEXT NOT NULL,
    cierre TEXT NOT NULL,

    -- Metadata
    fecha DATE,
    duracion VARCHAR(50),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_experiences_user_id ON experiences(user_id);
CREATE INDEX idx_experiences_unit_id ON experiences(unit_id);
```

#### `experience_objectives` (Many-to-Many)
```sql
CREATE TABLE experience_objectives (
    experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, objective_id)
);

CREATE INDEX idx_exp_obj_experience ON experience_objectives(experience_id);
CREATE INDEX idx_exp_obj_objective ON experience_objectives(objective_id);
```

#### `recursos`
```sql
CREATE TABLE recursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,

    tipo VARCHAR(50) NOT NULL, -- 'material' | 'evaluacion'
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cantidad INTEGER,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recursos_user_id ON recursos(user_id);
CREATE INDEX idx_recursos_experience_id ON recursos(experience_id);
CREATE INDEX idx_recursos_tipo ON recursos(tipo);
```

#### `students`
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    run VARCHAR(50),
    fecha_nacimiento DATE,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_user_id ON students(user_id);
```

#### `asistencias`
```sql
CREATE TABLE asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    experience_id UUID REFERENCES experiences(id) ON DELETE SET NULL,

    fecha DATE NOT NULL,
    estado VARCHAR(50) NOT NULL, -- 'presente' | 'ausente' | 'justificado'

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_asistencias_student_id ON asistencias(student_id);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
```

#### `evaluaciones`
```sql
CREATE TABLE evaluaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    indicator_id UUID NOT NULL REFERENCES objective_indicators(id) ON DELETE CASCADE,
    experience_id UUID REFERENCES experiences(id) ON DELETE SET NULL,

    nivel VARCHAR(50) NOT NULL, -- 'L' | 'ML' | 'PL' | 'NL'
    observacion TEXT,
    fecha DATE NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evaluaciones_student_id ON evaluaciones(student_id);
CREATE INDEX idx_evaluaciones_indicator_id ON evaluaciones(indicator_id);
CREATE INDEX idx_evaluaciones_fecha ON evaluaciones(fecha);
```

#### `planificaciones`
```sql
CREATE TABLE planificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,

    nombre VARCHAR(255) NOT NULL,

    -- Contenido generado automáticamente (puede ser JSON o relacional)
    contenido JSONB NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_planificaciones_user_id ON planificaciones(user_id);
CREATE INDEX idx_planificaciones_unit_id ON planificaciones(unit_id);
```

### Tablas de Datos de Referencia (Estáticos - Seeded)

#### `ambitos`
```sql
CREATE TABLE ambitos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);
```

#### `nucleos`
```sql
CREATE TABLE nucleos (
    id VARCHAR(50) PRIMARY KEY,
    ambito_id VARCHAR(50) NOT NULL REFERENCES ambitos(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

CREATE INDEX idx_nucleos_ambito_id ON nucleos(ambito_id);
```

#### `oas` (Objetivos de Aprendizaje)
```sql
CREATE TABLE oas (
    code VARCHAR(50) PRIMARY KEY, -- 'OA01', 'OA02', etc.
    nucleo_id VARCHAR(50) NOT NULL REFERENCES nucleos(id),
    texto TEXT NOT NULL,
    nivel VARCHAR(50) -- 'Nivel 1' | 'Nivel 2'
);

CREATE INDEX idx_oas_nucleo_id ON oas(nucleo_id);
```

#### `oats` (Objetivos Transversales)
```sql
CREATE TABLE oats (
    id VARCHAR(50) PRIMARY KEY, -- 'OAT-ID-1', etc.
    nucleo_id VARCHAR(50) REFERENCES nucleos(id),
    texto TEXT NOT NULL,
    categoria VARCHAR(100) -- Para agrupar OATs
);

CREATE INDEX idx_oats_nucleo_id ON oats(nucleo_id);
```

#### `efemerides`
```sql
CREATE TABLE efemerides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) -- 'nacional' | 'internacional' | 'institucional'
);

CREATE INDEX idx_efemerides_fecha ON efemerides(fecha);
```

---

## API Backend: Endpoints

### Autenticación (`/api/auth`)

- **POST** `/api/auth/register` - Registrar nueva educadora (admin only)
- **POST** `/api/auth/login` - Login y obtener JWT
- **POST** `/api/auth/refresh` - Refresh token
- **GET** `/api/auth/me` - Obtener usuario actual
- **POST** `/api/auth/logout` - Invalidar token (opcional con blacklist)

### Usuarios (`/api/users`) - Admin only

- **GET** `/api/users` - Listar todos los usuarios
- **GET** `/api/users/{id}` - Obtener usuario por ID
- **PUT** `/api/users/{id}` - Actualizar usuario
- **DELETE** `/api/users/{id}` - Eliminar usuario
- **PATCH** `/api/users/{id}/activate` - Activar/desactivar usuario

### Unidades (`/api/units`)

- **GET** `/api/units` - Listar unidades del usuario actual
  - Query params: `?year=2025&semester=1`
- **POST** `/api/units` - Crear nueva unidad
- **GET** `/api/units/{id}` - Obtener unidad por ID
- **PUT** `/api/units/{id}` - Actualizar unidad
- **DELETE** `/api/units/{id}` - Eliminar unidad
- **GET** `/api/units/{id}/objectives` - Obtener objetivos de la unidad
- **GET** `/api/units/{id}/experiences` - Obtener experiencias de la unidad

### Objetivos (`/api/objectives`)

- **GET** `/api/objectives` - Listar objetivos del usuario actual
  - Query params: `?unit_id=xxx&nucleo_id=xxx`
- **POST** `/api/objectives` - Crear nuevo objetivo (desde wizard)
- **GET** `/api/objectives/{id}` - Obtener objetivo por ID
- **PUT** `/api/objectives/{id}` - Actualizar objetivo
- **DELETE** `/api/objectives/{id}` - Eliminar objetivo
- **GET** `/api/objectives/{id}/indicators` - Obtener indicadores

### Experiencias (`/api/experiences`)

- **GET** `/api/experiences` - Listar experiencias del usuario actual
  - Query params: `?unit_id=xxx`
- **POST** `/api/experiences` - Crear nueva experiencia
- **GET** `/api/experiences/{id}` - Obtener experiencia por ID
- **PUT** `/api/experiences/{id}` - Actualizar experiencia
- **DELETE** `/api/experiences/{id}` - Eliminar experiencia
- **POST** `/api/experiences/{id}/objectives` - Vincular objetivos
- **DELETE** `/api/experiences/{id}/objectives/{objective_id}` - Desvincular objetivo

### Recursos (`/api/recursos`)

- **GET** `/api/recursos` - Listar recursos del usuario
  - Query params: `?tipo=material&experience_id=xxx`
- **POST** `/api/recursos` - Crear nuevo recurso
- **GET** `/api/recursos/{id}` - Obtener recurso por ID
- **PUT** `/api/recursos/{id}` - Actualizar recurso
- **DELETE** `/api/recursos/{id}` - Eliminar recurso

### Estudiantes (`/api/students`)

- **GET** `/api/students` - Listar estudiantes del usuario
- **POST** `/api/students` - Crear nuevo estudiante
- **GET** `/api/students/{id}` - Obtener estudiante por ID
- **PUT** `/api/students/{id}` - Actualizar estudiante
- **DELETE** `/api/students/{id}` - Eliminar estudiante
- **POST** `/api/students/bulk-import` - Importar múltiples estudiantes desde CSV

### Asistencias (`/api/asistencias`)

- **GET** `/api/asistencias` - Listar asistencias
  - Query params: `?student_id=xxx&fecha=2025-01-15`
- **POST** `/api/asistencias` - Registrar asistencia
- **POST** `/api/asistencias/bulk` - Registrar asistencia masiva

### Evaluaciones (`/api/evaluaciones`)

- **GET** `/api/evaluaciones` - Listar evaluaciones
  - Query params: `?student_id=xxx&indicator_id=xxx`
- **POST** `/api/evaluaciones` - Crear evaluación
- **PUT** `/api/evaluaciones/{id}` - Actualizar evaluación
- **DELETE** `/api/evaluaciones/{id}` - Eliminar evaluación
- **POST** `/api/evaluaciones/bulk` - Guardar evaluaciones masivas

### Planificaciones (`/api/planificaciones`)

- **GET** `/api/planificaciones` - Listar planificaciones del usuario
- **POST** `/api/planificaciones/generate` - Generar planificación desde unidad
- **GET** `/api/planificaciones/{id}` - Obtener planificación por ID
- **DELETE** `/api/planificaciones/{id}` - Eliminar planificación
- **GET** `/api/planificaciones/{id}/export` - Exportar planificación (PDF/Excel)

### Datos de Referencia (`/api/reference`)

- **GET** `/api/reference/ambitos` - Listar todos los ámbitos
- **GET** `/api/reference/nucleos` - Listar todos los núcleos
  - Query params: `?ambito_id=xxx`
- **GET** `/api/reference/oas` - Listar todos los OAs
  - Query params: `?nucleo_id=xxx`
- **GET** `/api/reference/oats` - Listar todos los OATs
  - Query params: `?nucleo_id=xxx`
- **GET** `/api/reference/efemerides` - Listar efemérides
  - Query params: `?mes=3`

### Import/Export (`/api/data`)

- **POST** `/api/data/export` - Exportar todos los datos del usuario a JSON
- **POST** `/api/data/import` - Importar datos desde JSON (con validación)
- **POST** `/api/data/migrate-from-localstorage` - Endpoint especial para migración inicial

---

## Autenticación y Autorización

### Flujo JWT

1. **Login:**
   - Usuario envía email + password
   - Backend valida y retorna JWT access_token + refresh_token
   - Frontend guarda tokens en localStorage (o httpOnly cookies)

2. **Requests autenticados:**
   - Frontend envía header: `Authorization: Bearer {access_token}`
   - Backend valida JWT y extrae user_id + role
   - Middleware verifica permisos

3. **Refresh:**
   - Cuando access_token expira (15min), usar refresh_token (7 días)
   - Backend retorna nuevo access_token

4. **Logout:**
   - Frontend elimina tokens de localStorage
   - (Opcional) Backend agrega token a blacklist

### Permisos por Rol

**Admin:**
- CRUD de usuarios
- Acceso a todos los datos (vista global)
- Gestión de datos de referencia

**Educadora:**
- CRUD de sus propios datos (units, objectives, experiences, students, etc.)
- Solo puede ver/editar sus propios registros
- No puede crear otros usuarios

### Implementación en FastAPI

```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Uso en routers:
@router.get("/users", dependencies=[Depends(require_admin)])
async def list_users():
    pass
```

---

## Frontend React: Arquitectura

### State Management

**Opción Recomendada:** TanStack Query (React Query) + Zustand

- **TanStack Query:** Para data fetching, cache, sincronización con backend
- **Zustand:** Para estado global de UI (tema, sidebar, modals)

**Ejemplo - Hook con React Query:**

```typescript
// hooks/useUnits.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUnits, createUnit, deleteUnit } from '@/services/api/units';

export function useUnits(year?: number, semester?: number) {
  return useQuery({
    queryKey: ['units', year, semester],
    queryFn: () => getUnits({ year, semester }),
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}
```

### Form Validation

**React Hook Form + Zod**

```typescript
// Ejemplo - UnitForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const unitSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  year: z.number().min(2020).max(2030),
  semester: z.enum(['1', '2']),
  fecha_inicio: z.date().optional(),
  fecha_fin: z.date().optional(),
});

type UnitFormData = z.infer<typeof unitSchema>;

export function UnitForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
  });

  const createUnitMutation = useCreateUnit();

  const onSubmit = (data: UnitFormData) => {
    createUnitMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name')}
        error={errors.name?.message}
      />
      {/* ... */}
    </form>
  );
}
```

### Routing

**React Router v6**

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/objectives" element={<ObjectivesPage />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/planificaciones" element={<PlanificacionesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Componente Crítico: ObjectiveWizard (Stepper 5 pasos)

```typescript
// components/objectives/ObjectiveWizard.tsx
import { useState } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Step1AmbitoNucleo } from './steps/Step1AmbitoNucleo';
import { Step2SelectOAs } from './steps/Step2SelectOAs';
import { Step3SelectOATs } from './steps/Step3SelectOATs';
import { Step4SpecificObjective } from './steps/Step4SpecificObjective';
import { Step5Review } from './steps/Step5Review';

export function ObjectiveWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    ambitoId: null,
    nucleoId: null,
    selectedOAs: [],
    selectedOATs: [],
    tercerObjetivoOA: null,
    specificObjective: '',
    indicators: [],
  });

  const steps = [
    { id: 1, label: 'Ámbito y Núcleo' },
    { id: 2, label: 'Objetivos de Aprendizaje' },
    { id: 3, label: 'Objetivos Transversales' },
    { id: 4, label: 'Objetivo Específico' },
    { id: 5, label: 'Revisión' },
  ];

  const handleNext = () => {
    // Validar paso actual antes de avanzar
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    createObjectiveMutation.mutate(wizardData);
  };

  return (
    <div>
      <Stepper steps={steps} currentStep={currentStep} />

      {currentStep === 1 && (
        <Step1AmbitoNucleo
          data={wizardData}
          onChange={setWizardData}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <Step2SelectOAs
          data={wizardData}
          onChange={setWizardData}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {/* ... steps 3, 4, 5 */}
    </div>
  );
}
```

---

## Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: educparv_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME:-educparv}
      POSTGRES_USER: ${DB_USER:-educparv_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-FAST", "pg_isready", "-U", "${DB_USER:-educparv_user}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # FastAPI Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: educparv_backend
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${DB_USER:-educparv_user}:${DB_PASSWORD:-changeme}@db:5432/${DB_NAME:-educparv}
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 15
      REFRESH_TOKEN_EXPIRE_DAYS: 7
      CORS_ORIGINS: ${CORS_ORIGINS:-http://localhost:3000,http://localhost:80}
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - uploads_data:/app/uploads  # Volumen para archivos subidos
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  # React Frontend (Development)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: educparv_frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:8000}
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

  # Nginx Reverse Proxy (Production)
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: educparv_nginx
    restart: unless-stopped
    depends_on:
      - backend
      - frontend
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    profiles:
      - production

volumes:
  postgres_data:
    driver: local
  uploads_data:
    driver: local

networks:
  default:
    name: educparv_network
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8000

# Default command (overridden in docker-compose)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production serve stage
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx/nginx.conf
server {
    listen 80;
    server_name localhost;

    # Frontend (React)
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Migración desde localStorage

### Estrategia de Migración

**Endpoint especial:** `POST /api/data/migrate-from-localstorage`

**Body:**
```json
{
  "version": "2.0",
  "currentYear": 2025,
  "currentSemestre": 1,
  "selectedUnit": null,
  "units": [...],
  "savedObjectives": [...],
  "savedExperiences": [...],
  "savedRecursos": [...],
  "planificaciones": [...]
}
```

**Proceso:**
1. Usuario exporta datos desde localStorage usando botón "Exportar" (actual funcionalidad)
2. Usuario se registra/logea en nuevo sistema
3. Usuario sube archivo JSON en nueva interfaz de "Importar desde versión anterior"
4. Backend valida y transforma datos:
   - Asocia user_id a todas las entidades
   - Convierte IDs de localStorage (números) a UUIDs
   - Valida integridad referencial
   - Inserta en PostgreSQL manteniendo relaciones
5. Frontend muestra reporte de migración con éxitos/errores

**Código Backend (Servicio):**

```python
# app/services/import_export_service.py
from app.models import Unit, Objective, Experience, Recurso, Student
from uuid import uuid4

async def migrate_from_localstorage(user_id: str, data: dict, db: Session):
    migration_report = {
        "units": {"success": 0, "errors": []},
        "objectives": {"success": 0, "errors": []},
        "experiences": {"success": 0, "errors": []},
        "recursos": {"success": 0, "errors": []},
    }

    # Mapeo de IDs viejos a nuevos UUIDs
    unit_id_map = {}
    objective_id_map = {}
    experience_id_map = {}

    # 1. Migrar Units
    for old_unit in data.get("units", []):
        try:
            new_unit = Unit(
                id=uuid4(),
                user_id=user_id,
                name=old_unit["name"],
                year=old_unit.get("year", 2025),
                semester=old_unit.get("semester", 1),
                fecha_inicio=old_unit.get("fechaInicio"),
                fecha_fin=old_unit.get("fechaFin"),
                efemerides=old_unit.get("efemerides", []),
            )
            db.add(new_unit)
            unit_id_map[old_unit["id"]] = new_unit.id
            migration_report["units"]["success"] += 1
        except Exception as e:
            migration_report["units"]["errors"].append(str(e))

    db.commit()

    # 2. Migrar Objectives
    for old_obj in data.get("savedObjectives", []):
        try:
            new_unit_id = unit_id_map.get(old_obj.get("unitId"))

            new_obj = Objective(
                id=uuid4(),
                user_id=user_id,
                unit_id=new_unit_id,
                ambito_id=old_obj["ambitoId"],
                nucleo_id=old_obj["nucleoId"],
                selected_oas=old_obj["selectedOAs"],
                selected_oats=old_obj["selectedOATs"],
                specific_objective=old_obj["specificObjective"],
                tercer_objetivo_oa=old_obj.get("tercerObjetivoOA"),
            )
            db.add(new_obj)
            objective_id_map[old_obj["id"]] = new_obj.id

            # Agregar indicadores
            for idx, indicator in enumerate(old_obj.get("indicators", [])):
                new_indicator = ObjectiveIndicator(
                    id=uuid4(),
                    objective_id=new_obj.id,
                    text=indicator["text"],
                    position=idx,
                )
                db.add(new_indicator)

            migration_report["objectives"]["success"] += 1
        except Exception as e:
            migration_report["objectives"]["errors"].append(str(e))

    db.commit()

    # 3. Migrar Experiences y relaciones
    # ... similar pattern

    return migration_report
```

---

## Fases de Implementación

### FASE 1: Setup de Infraestructura (1-2 días)

**Tareas:**
1. Crear estructura de monorepo
2. Configurar Docker Compose
3. Setup PostgreSQL + Alembic
4. Configurar FastAPI base con CORS
5. Setup React + Vite + TypeScript
6. Configurar Tailwind CSS + shadcn/ui
7. Variables de entorno (.env.example)

**Entregable:**
- Docker Compose funcional con DB, backend hello world, frontend hello world
- Documentación de setup en README.md

---

### FASE 2: Backend Core + Autenticación (2-3 días)

**Tareas:**
1. Implementar modelos SQLAlchemy:
   - User
   - Models de datos de referencia (Ambito, Nucleo, OA, OAT, Efemeride)
2. Crear sistema de autenticación:
   - JWT utils (core/security.py)
   - Register, Login, Refresh endpoints
   - Middleware de autenticación
   - RBAC (permissions.py)
3. Seeders para datos de referencia:
   - Migrar AMBITOS, OAS, OAT, EFEMERIDES desde data.js
4. Testing de autenticación

**Entregable:**
- Login/Register funcional
- Tokens JWT working
- Datos de referencia en DB
- Tests unitarios de auth

---

### FASE 3: Backend - Modelos y API CRUD (3-4 días)

**Tareas:**
1. Implementar modelos SQLAlchemy:
   - Unit, Objective, ObjectiveIndicator
   - Experience, ExperienceObjectives (M2M)
   - Recurso, Student, Asistencia, Evaluacion
   - Planificacion
2. Crear routers y schemas Pydantic para:
   - Units (CRUD completo)
   - Objectives (CRUD + wizard endpoints)
   - Experiences (CRUD + relaciones)
   - Recursos (CRUD)
   - Students (CRUD)
3. Implementar servicios de lógica de negocio:
   - unit_service.py
   - objective_service.py
   - experience_service.py
4. Testing de endpoints

**Entregable:**
- API REST completa documentada (Swagger)
- Endpoints protegidos con JWT
- Tests de integración

---

### FASE 4: Frontend - Setup + Autenticación (2 días)

**Tareas:**
1. Setup TanStack Query + Zustand
2. Configurar Axios con interceptors
3. Crear tipos TypeScript desde schemas backend
4. Implementar LoginPage + LoginForm
5. Implementar ProtectedRoute + RoleGuard
6. Crear layout principal (AppLayout, Header, Sidebar)
7. Gestión de tokens en localStorage
8. Hook useAuth

**Entregable:**
- Login funcional con JWT
- Rutas protegidas working
- Layout base con navegación

---

### FASE 5: Frontend - Módulo Unidades (2 días)

**Tareas:**
1. Crear componentes shadcn/ui necesarios:
   - Button, Dialog, Input, Card, Badge, Toast
2. Implementar UnitsPage con:
   - UnitList (grid de cards)
   - UnitCard (hover states, actions)
   - UnitModal (form crear/editar)
   - UnitForm con validación (React Hook Form + Zod)
3. Hooks: useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit
4. Empty states y loading skeletons
5. Toast notifications en acciones

**Entregable:**
- Módulo de Unidades funcional
- CRUD completo con feedback visual
- Validación de formularios

---

### FASE 6: Frontend - Módulo Objetivos + Stepper (3-4 días)

**Tareas:**
1. Crear componente Stepper (shadcn/ui style)
2. Implementar ObjectiveWizard con 5 pasos:
   - Step1AmbitoNucleo (selects con datos de referencia)
   - Step2SelectOAs (checkbox list filtrado por núcleo)
   - Step3SelectOATs (checkbox list filtrado por núcleo)
   - Step4SpecificObjective (textarea + indicadores dinámicos)
   - Step5Review (resumen antes de guardar)
3. Lógica de navegación: nextStep, prevStep, validación por paso
4. Hooks: useObjectives, useCreateObjective, useReferenceData
5. ObjectiveList (saved objectives con cards)
6. ObjectiveCard (display de OAs, OATs, indicadores)

**Entregable:**
- Wizard de objetivos funcional con 5 pasos
- Validación por paso
- Lista de objetivos guardados
- Vinculación con unidades

---

### FASE 7: Frontend - Módulo Experiencias (2 días)

**Tareas:**
1. Implementar ExperiencesPage con:
   - ExperienceList (cards)
   - ExperienceCard (preview de Inicio/Desarrollo/Cierre)
   - ExperienceModal (form)
   - ExperienceForm (selección de unidad, objetivos, estructura pedagógica)
2. Multi-select de objetivos
3. Hooks: useExperiences, useCreateExperience
4. Vinculación con recursos

**Entregable:**
- Módulo de Experiencias funcional
- Vinculación con objetivos working

---

### FASE 8: Frontend - Módulo Planificaciones (2 días)

**Tareas:**
1. Implementar PlanificacionesPage con:
   - Selección de unidad
   - Botón "Generar Planificación"
   - PlanificacionTable (tabla completa con objetivos, experiencias, indicadores)
2. Lógica de generación automática (backend service)
3. Preview e impresión
4. Export a PDF (opcional con jsPDF o backend)

**Entregable:**
- Generación de planificación automática
- Tabla completa con datos
- Export/impresión

---

### FASE 9: Módulo Estudiantes + Evaluaciones (2-3 días)

**Tareas:**
1. Backend:
   - Endpoints de Students, Asistencias, Evaluaciones
2. Frontend:
   - StudentTable (lista de estudiantes)
   - Registro de asistencia (tabla con checkboxes)
   - Formulario de evaluación por indicador
   - Visualización de evaluaciones (por estudiante o por objetivo)

**Entregable:**
- Gestión de estudiantes completa
- Registro de asistencia
- Sistema de evaluación por indicadores

---

### FASE 10: Import/Export + Migración (2 días)

**Tareas:**
1. Backend:
   - Endpoint `/api/data/export` (generar JSON completo)
   - Endpoint `/api/data/import` (validar y restaurar)
   - Endpoint `/api/data/migrate-from-localstorage` (migración especial)
2. Frontend:
   - Botón "Exportar Datos"
   - Modal de importación con upload de JSON
   - Modal de migración desde localStorage
   - Reporte de migración con errores/éxitos

**Entregable:**
- Sistema de backup completo
- Migración desde localStorage working
- Validación de datos importados

---

### FASE 11: Refinamiento UX + Responsive (2 días)

**Tareas:**
1. Revisar responsive design en mobile/tablet
2. Ajustar stepper para mobile (vertical)
3. Mejorar empty states con ilustraciones
4. Agregar tooltips explicativos
5. Implementar tour guiado inicial (Driver.js)
6. Micro-interacciones (smooth scroll, fade transitions)
7. Verificar WCAG AA (contraste, aria-labels)

**Entregable:**
- Aplicación responsive en todos los dispositivos
- UX pulida con tour guiado
- Accesibilidad validada

---

### FASE 12: Testing + Documentación (2 días)

**Tareas:**
1. Testing E2E con Playwright o Cypress:
   - Flujo completo: login → crear unidad → crear objetivo (wizard) → crear experiencia → generar planificación
2. Testing de integración backend (pytest)
3. Documentación:
   - README.md con setup instructions
   - API documentation (Swagger mejorado)
   - Guía de usuario (screenshots)
4. Scripts de deployment (docker-compose production)

**Entregable:**
- Suite de tests E2E
- Documentación completa
- Scripts de deployment

---

## Estimación Total

| Fase | Días | Tareas Principales |
|------|------|--------------------|
| 1. Setup Infraestructura | 1-2 | Docker, DB, React, FastAPI base |
| 2. Backend Auth | 2-3 | JWT, User model, permissions |
| 3. Backend CRUD | 3-4 | Modelos, routers, servicios |
| 4. Frontend Auth | 2 | Login, tokens, routes |
| 5. Frontend Unidades | 2 | CRUD unidades |
| 6. Frontend Objetivos | 3-4 | Wizard 5 pasos |
| 7. Frontend Experiencias | 2 | CRUD experiencias |
| 8. Frontend Planificaciones | 2 | Generación automática |
| 9. Estudiantes + Evaluaciones | 2-3 | CRUD + asistencia |
| 10. Import/Export | 2 | Backup y migración |
| 11. Refinamiento UX | 2 | Responsive, tour |
| 12. Testing + Docs | 2 | E2E, documentación |

**TOTAL ESTIMADO:** 25-32 días de desarrollo

---

## Riesgos y Mitigaciones

### Riesgo 1: Complejidad del Wizard de Objetivos
- **Impacto:** Alto - Es el flujo más crítico
- **Mitigación:**
  - Crear componente Stepper reutilizable primero
  - Implementar validación por paso incremental
  - Testing exhaustivo de cada paso

### Riesgo 2: Migración de Datos desde localStorage
- **Impacto:** Medio - Usuarios con datos existentes
- **Mitigación:**
  - Crear endpoint robusto con validación estricta
  - Generar reporte detallado de errores
  - Ofrecer exportar datos antes de migrar
  - Testing con datos reales exportados

### Riesgo 3: Performance con Muchos Datos
- **Impacto:** Medio - Tablas grandes (estudiantes, evaluaciones)
- **Mitigación:**
  - Implementar paginación en endpoints
  - Usar React Query con cache inteligente
  - Índices en DB bien diseñados
  - Virtual scrolling en tablas grandes

### Riesgo 4: Mantener Diseño shadcn/ui Consistente
- **Impacto:** Bajo - Estético pero importante
- **Mitigación:**
  - Usar CLI de shadcn/ui para componentes base
  - Documentar tokens CSS en globals.css
  - Revisar guía ESTILOS.md regularmente
  - Design system review en Fase 11

---

## Stack Tecnológico Final

### Backend
- **Runtime:** Python 3.11+
- **Framework:** FastAPI 0.104+
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic
- **Database:** PostgreSQL 15+
- **Auth:** python-jose (JWT), passlib (bcrypt)
- **Validation:** Pydantic v2
- **Testing:** pytest, pytest-asyncio
- **ASGI Server:** Uvicorn

### Frontend
- **Runtime:** Node.js 20+
- **Framework:** React 18+
- **Language:** TypeScript 5+
- **Build Tool:** Vite 5+
- **UI Library:** shadcn/ui (Radix UI + Tailwind)
- **Styling:** Tailwind CSS 3+
- **State Management:** TanStack Query + Zustand
- **Forms:** React Hook Form + Zod
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Testing:** Vitest + React Testing Library + Playwright

### DevOps
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **Environment:** .env files
- **Version Control:** Git

---

## Variables de Entorno

### Backend (`.env`)
```bash
# Database
DATABASE_URL=postgresql://educparv_user:changeme@db:5432/educparv

# JWT
SECRET_KEY=your-super-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:80

# App
APP_NAME="Sistema Educación Parvularia"
APP_VERSION=1.0.0
DEBUG=True
```

### Frontend (`.env`)
```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="Sistema Educación Parvularia"
```

---

## Archivos Críticos a Crear/Modificar

### Críticos Backend
1. `backend/app/main.py` - FastAPI app initialization
2. `backend/app/database.py` - SQLAlchemy session management
3. `backend/app/models/objective.py` - Modelo más complejo (wizard)
4. `backend/app/routers/objectives.py` - Endpoints del wizard
5. `backend/app/services/objective_service.py` - Lógica de wizard
6. `backend/app/core/security.py` - JWT + password hashing
7. `backend/app/dependencies.py` - get_current_user, require_admin
8. `backend/app/seed/seed_reference_data.py` - Seedear AMBITOS, OAs, OATs
9. `backend/alembic/versions/001_initial.py` - Migración inicial

### Críticos Frontend
1. `frontend/src/App.tsx` - Routing + providers
2. `frontend/src/config/api.ts` - Axios instance con JWT interceptors
3. `frontend/src/components/ui/stepper.tsx` - Componente stepper custom
4. `frontend/src/components/objectives/ObjectiveWizard.tsx` - Wizard 5 pasos
5. `frontend/src/hooks/useAuth.ts` - Hook de autenticación
6. `frontend/src/hooks/useObjectives.ts` - React Query hooks
7. `frontend/src/services/api/objectives.ts` - API calls
8. `frontend/src/types/objective.ts` - TypeScript types
9. `frontend/src/styles/globals.css` - Tailwind + CSS variables shadcn

### Docker
1. `docker-compose.yml` - Orquestación completa
2. `backend/Dockerfile` - Container backend
3. `frontend/Dockerfile` - Container frontend (multi-stage)
4. `nginx/nginx.conf` - Reverse proxy config

---

## Próximos Pasos Inmediatos

1. **Revisión de este plan con el usuario** ✅
2. **Confirmación de prioridades y ajustes**
3. **Comenzar FASE 1:** Setup de infraestructura
4. **Crear branch de migración:** `git checkout -b feature/backend-react-migration`

---

## Referencias

- **FastAPI:** https://fastapi.tiangolo.com/
- **SQLAlchemy 2.0:** https://docs.sqlalchemy.org/
- **React Query (TanStack):** https://tanstack.com/query/latest
- **shadcn/ui:** https://ui.shadcn.com/
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/
- **Bases Curriculares 2019:** Ministerio de Educación Chile
- **ESTILOS.md:** Guía institucional Valle del Itata

---

## Notas Finales

- Este plan mantiene **100% el diseño shadcn/ui** del sistema actual
- La migración es **incremental y segura** gracias al endpoint de migración
- La arquitectura está diseñada para **escalar** (multi-tenancy listo)
- El sistema permite **backup/restore completo** de datos
- Todos los **flujos UX actuales** se mantienen (wizard, toasts, validaciones)
- El código está **listo para migración a backend** desde el día 1

**El objetivo es crear una versión profesional, escalable y multi-usuario del sistema actual, manteniendo toda la calidad UX ya implementada.**
