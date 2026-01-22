# Notion Smart Tickets API

API REST en Node.js para la creación inteligente de tickets en Notion, utilizando IA (OpenAI) para analizar y estructurar reportes de bugs o solicitudes.

## Demo: Creación de tarjetas Notion vía Telegram

Click en la imagen inferior para ver el demo.
[![Ver demo](https://drive.google.com/uc?export=view&id=1Y3DfgSDiAwlN4P0e7AOdkvraB3WJEiju)](https://drive.google.com/file/d/118KC4zLflgMOAMibwre9RefIl2oApL1P/view?usp=sharing)

En esta demo se puede observar cómo se crean tarjetas de Notion a través de mensajes de Telegram.

### Objetivo

El propósito de este flujo es que la persona que reporta un hotfix pueda enviar un mensaje simple, el cual es procesado por IA y transformado en un documento de Notion con una estructura bien definida. Esto facilita que el desarrollador comprenda rápidamente el problema reportado.

Además, la IA genera preguntas relevantes para que quien reportó el issue pueda complementar la información directamente en la tarjeta.

### Campos automáticos

La tarjeta incluye los siguientes campos, todos asignados automáticamente por la IA según el contexto del mensaje:

- **Fecha**
- **Prioridad**
- **Impacto**
- **Proyecto**
- **Estado**

### Beneficio

El usuario que reporta el problema no necesita seleccionar estos valores manualmente ni asignar puntuaciones. La IA toma estas decisiones basándose en el contexto proporcionado en el prompt, agilizando significativamente el proceso de reporte.

### NOTA

Existe otro endpoint llamado smart-card que sirve para crear las tarjetas, este tiene incluso una mayor funcionalidad ya que acepta imágenes. En una segunda revisión de la app se realizará esa carga para que pueda hacerlo desde el bot de Telegram.

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
│   └── telegram.controller.js  # Controladores para endpoints de Telegram
├── routes/
│   └── app.routes.js           # Definición de rutas de la API
├── services/
│   └── notion.service.js       # Lógica de negocio (validación, análisis IA, creación de tickets)
└── utils/
    ├── notion.util.js          # Utilidades para interactuar con la API de Notion
    ├── openai.util.js          # Utilidades para interactuar con OpenAI
    └── supabase.util.js        # Utilidades para storage de Supabase
    └── telegram.util.js        # Utilidades para webhook de Telegram
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

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

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

### 6. Configurar Telegram

1. Crear un bot en BotFather dentro de Telegram siguiendo la [documentación oficial](https://core.telegram.org/bots/tutorial) (crear un bot, colocarle un nombre, obtener token)
2. BotFather entrega el token y se utiliza para registrar un webhook al endpoint de tipo POST: https://api.telegram.org/bot$token/setWebhook y que el body sea: `
{
    "url": "ENDPOINT DEL WEBHOOK"
}
`
3. Se ingresa el token en el apartado del .env


## Ejecución

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints

### POST `/api/notion/smart-card`

Crea una tarjeta inteligente usando IA para analizar el mensaje. (Utilizado de ejemplo para corroborar funcionamiento para el webhook de Telegram)

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

### POST `/api/telegram/webhook`

Webhook para utilizar el Bot de Telegram (Hay que crear previamente un bot dentro de BotFather)

**Body (form-data):**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | string | Descripción del bug o solicitud |

## Funcionalidades de IA

- **Validación de mensajes**: Filtra mensajes no relevantes para tickets técnicos
- **Análisis automático**: Determina proyecto, prioridad e impacto basándose en el contexto
- **Generación de contenido**: Crea descripciones estructuradas en Markdown
- **Preguntas inteligentes**: Sugiere información adicional necesaria

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con watch |

## Notas

- Las imágenes subidas se almacenan en Supabase Storage y se adjuntan automáticamente al ticket
- El contenido se convierte de Markdown a bloques de Notion (headings, listas, imágenes, etc.)
- La IA usa GPT-3.5-turbo por defecto para el análisis de mensajes
- La versión actual del webhook de telegram solo soporta crear un ticket por mensaje
- La siguiente versión concatenará mensajes para evitar crear tickets por cada mensaje
- La última versión soportara subir imágenes para que tenga el soporte completo del endpoint original para Postman

## Licencia

ISC
