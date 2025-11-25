FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Build de Next.js
RUN npm run build



# ───────────────────────────────────────────
# 2️⃣ PRODUCTION STAGE
# ───────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copiar solo dependencias necesarias para prod
COPY package*.json ./
RUN npm install --omit=dev

# Copiar build y código necesario
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
