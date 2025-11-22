# Guía de Despliegue en Railway

Este proyecto es un monorepo que contiene tanto el `backend` como el `frontend`. Para desplegarlo correctamente en Railway, debes configurar dos servicios separados.

## 1. Configuración del Backend

1.  En tu dashboard de Railway, haz clic en **New Project** > **GitHub Repo** y selecciona este repositorio.
2.  Haz clic en el servicio que se acaba de crear (probablemente fallará el primer build, es normal).
3.  Ve a **Settings** > **General**.
4.  En la sección **Root Directory**, cambia `/` por `/backend`.
5.  Ve a **Variables**.
6.  Agrega las siguientes variables de entorno (si son necesarias para tu app, aunque el Dockerfile ya expone el puerto 3000):
    *   `PORT`: `3000`
    *   `CLIENT_URL`: `https://<TU_DOMINIO_FRONTEND>.up.railway.app` (Esto lo actualizarás después de desplegar el frontend).
7.  Railway detectará automáticamente el `Dockerfile` dentro de la carpeta `/backend` y comenzará el despliegue.
8.  Una vez desplegado, ve a **Settings** > **Networking** y genera un dominio (Generate Domain). Copia este dominio (ej: `backend-production.up.railway.app`).

## 2. Configuración del Frontend

1.  En el mismo proyecto de Railway, haz clic en **+ New** > **GitHub Repo** y selecciona **el mismo repositorio** nuevamente.
2.  Haz clic en este nuevo servicio.
3.  Ve a **Settings** > **General**.
4.  En la sección **Root Directory**, cambia `/` por `/frontend`.
5.  Ve a **Variables**.
6.  Agrega la siguiente variable de entorno **CRÍTICA** para que el frontend sepa dónde está el backend:
    *   `VITE_API_URL`: `https://<TU_DOMINIO_BACKEND>.up.railway.app` (Pega aquí el dominio que copiaste del paso anterior, asegúrate de incluir `https://`).
7.  Ve a **Settings** > **Networking** y genera un dominio para el frontend.
8.  Railway detectará el `Dockerfile` en `/frontend`, tomará la variable `VITE_API_URL` como argumento de construcción (gracias al cambio que hicimos) y generará los archivos estáticos con la URL correcta.

## 3. Paso Final

1.  Vuelve al servicio de **Backend**.
2.  Ve a **Variables**.
3.  Actualiza `CLIENT_URL` con el dominio de tu **Frontend** (ej: `https://frontend-production.up.railway.app`).
4.  El backend se reiniciará automáticamente.

¡Listo! Ahora tienes tu aplicación completa funcionando en Railway.
