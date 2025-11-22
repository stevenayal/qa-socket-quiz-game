# QA Socket Quiz Game

Juego interactivo de preguntas y respuestas en tiempo real para prácticas de QA.

## Stack Tecnológico

- **Backend**: Node.js, Express, Socket.IO, TypeScript
- **Frontend**: React, Vite, TailwindCSS, Zustand, Socket.IO Client
- **Infraestructura**: Docker, Docker Compose

## Requisitos Previos

- Node.js (v18+)
- Docker y Docker Compose (opcional)

## Instalación y Ejecución Local

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd qa-socket-quiz-game
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   El servidor correrá en `http://localhost:3000`.

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## Ejecución con Docker

Para levantar todo el entorno con un solo comando:

```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.

## Eventos Socket.IO

| Evento | Emisor | Descripción |
|--------|--------|-------------|
| `host:create_room` | Cliente (Host) | Crea una nueva sala |
| `player:join_room` | Cliente (Player) | Se une a una sala existente |
| `host:start_game` | Cliente (Host) | Inicia el juego |
| `game:new_question` | Servidor | Envía una nueva pregunta a todos |
| `player:submit_answer` | Cliente (Player) | Envía respuesta seleccionada |
| `game:answer_feedback` | Servidor | Feedback individual (correcta/incorrecta) |
| `room:state_update` | Servidor | Actualización general del estado de la sala |

## QA Manual Sugerido

1. **Crear Sala**: Abrir pestaña como Host, crear sala.
2. **Unirse**: Abrir pestaña Incógnito como Jugador, unirse con código.
3. **Jugar**: Iniciar juego, responder preguntas, verificar puntajes.
4. **Ranking**: Verificar tabla de posiciones al final.

## Despliegue (Deployment)

### Recomendación: Railway
Para este proyecto que usa **Socket.IO**, se recomienda usar **Railway** (o cualquier proveedor que soporte servidores persistentes como Render, DigitalOcean, AWS EC2).

**¿Por qué no Vercel para el Backend?**
Vercel es una plataforma "Serverless". Esto significa que las funciones se apagan cuando no se usan. Socket.IO necesita una conexión constante y persistente, lo cual no funciona bien en entornos serverless estándar sin adaptadores complejos.

### Opción 1: Todo en Railway (Más fácil)
1. Conecta tu repo a Railway.
2. Railway detectará los `Dockerfile` en `/backend` y `/frontend`.
3. Configura las variables de entorno:
   - Backend: `PORT=3000`, `CLIENT_URL=https://tu-frontend.up.railway.app`
   - Frontend: `VITE_API_URL=https://tu-backend.up.railway.app`

### Opción 2: Híbrido (Frontend en Vercel, Backend en Railway)
- **Backend** en Railway (para los Sockets).
- **Frontend** en Vercel (para mejor distribución CDN).
  - En Vercel, configura la variable de entorno `VITE_API_URL` apuntando a tu backend de Railway.

## Licencia

MIT
