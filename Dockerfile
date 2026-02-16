FROM node:20-alpine

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build (optional, to reduce image size)
RUN npm prune --production

EXPOSE 20000

# Run migrations and start app
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then echo \"Running migrations...\"; npx prisma migrate deploy --schema=prisma/schema.prisma; else echo \"DATABASE_URL not set, skipping migrations\"; fi; node dist/index.js"]
