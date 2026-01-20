# Notion Smart Tickets API

API REST en Node.js para la creación inteligente de tickets en Notion, utilizando IA (OpenAI) para analizar y estructurar reportes de bugs o solicitudes.

## Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Node.js** | 21.1.0+ | Runtime de JavaScript |
| **Express** | 4.18.2 | Framework web minimalista |
| **OpenAI** | 6.16.0 | Integración con GPT para análisis de mensajes |
| **Notion SDK** | 5.7.0 | Cliente oficial de la API de Notion |
| **Supabase** | 2.90.1 | Storage para almacenamiento de imágenes |
| **Babel** | 7.28.6 | Transpilador para ES Modules |
| **dotenv** | 17.2.3 | Manejo de variables de entorno |
| **express-fileupload** | 1.5.2 | Middleware para subida de archivos |

## Estructura del Proyecto

```
src/
├── index.js                    # Punto de entrada de la aplicación
├── controllers/
│   └── notion.controller.js    # Controladores para endpoints de Notion
├── routes/
│   └── notion.routes.js        # Definición de rutas de la API
├── services/
│   └── notion.service.js       # Lógica de negocio (validación, análisis IA, creación de tickets)
└── utils/
    ├── notion.util.js          # Utilidades para interactuar con la API de Notion
    ├── openai.util.js          # Utilidades para interactuar con OpenAI
    └── supabase.util.js        # Utilidades para storage de Supabase
```

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/BrayanSalas/notion-card-helper
cd newproject
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# OpenAI
OPENAI_API_KEY=tu_api_key_de_openai

# Notion
NOTION_API_KEY=tu_token_de_integracion_notion
NOTION_DATABASE_ID=id_de_tu_base_de_datos_notion

# Supabase
SUPABASE_URL=tu_url_de_proyecto_supabase
SUPABASE_SERVICE_KEY=tu_service_key_de_supabase

# Server
PORT=3000
```

### 4. Configurar Notion

1. Crea una [integración en Notion](https://www.notion.so/my-integrations)
2. Conecta la integración a tu base de datos
3. Asegúrate de que la base de datos tenga las propiedades necesarias (Title, Project, Priority, Impact, etc.)

### 5. Configurar Supabase

1. Crea un bucket llamado `notion-attachments` en Supabase Storage
2. Configura las políticas de acceso público para lectura

## Ejecución

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints

### POST `/api/notion/card`

Crea una tarjeta en Notion con datos específicos.

**Body:**
```json
{
  "title": "Título del ticket",
  "text": "Descripción en markdown",
  "project": "Frontend|Backend",
  "priority": "Very High|High|Medium|Low|Very Low",
  "impact": "Very High|High|Medium|Low|Very Low",
  "date": "2026-01-19"
}
```

### POST `/api/notion/smart-card`

Crea una tarjeta inteligente usando IA para analizar el mensaje.

**Body (form-data):**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | string | Descripción del bug o solicitud |
| `images` | file(s) | Screenshots opcionales (max 50MB) |

**Ejemplo de respuesta:**
```json
{
  "message": "Tarjeta creada correctamente"
}
```

## Funcionalidades de IA

- **Validación de mensajes**: Filtra mensajes no relevantes para tickets técnicos
- **Análisis automático**: Determina proyecto, prioridad e impacto basándose en el contexto
- **Generación de contenido**: Crea descripciones estructuradas en Markdown
- **Preguntas inteligentes**: Sugiere información adicional necesaria

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia el servidor en modo desarrollo con watch |

## Notas

- Las imágenes subidas se almacenan en Supabase Storage y se adjuntan automáticamente al ticket
- El contenido se convierte de Markdown a bloques de Notion (headings, listas, imágenes, etc.)
- La IA usa GPT-3.5-turbo por defecto para el análisis de mensajes

## Licencia

ISC
