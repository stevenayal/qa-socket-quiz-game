FROM node:22-alpine as build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:22-alpine as build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# Copy backend artifacts
COPY --from=build-backend /app/backend/package*.json ./
COPY --from=build-backend /app/backend/node_modules ./node_modules
COPY --from=build-backend /app/backend/dist ./dist

# Copy frontend artifacts to a public directory
COPY --from=build-frontend /app/frontend/dist ./public

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
