<<<<<<< Updated upstream
FROM node:18-alpine

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm ci

# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/.env ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000
CMD npm run dev
=======
FROM node:21-alpine AS base


FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app

# COPY package.json .
# COPY jsconfig.json .
# COPY next.config.js .
# COPY /src /src
# COPY jsconfig.json .
# # COPY package.json package-lock.json ./
# RUN npm ci
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# # Rebuild the source code only when needed
# FROM base AS builder
# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules

# # RUN npm run build && npm ci
# RUN NEXT_PRIVATE_STANDALONE=true npm run build && npm ci

# # Production image, copy all the files and run next
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# # You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public

# # Set the correct permission for prerender cache
# RUN mkdir .next
# RUN chown nextjs:nodejs .next

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry.
# # ENV NEXT_TELEMETRY_DISABLED 1

# CMD ["node", "server.js"]
>>>>>>> Stashed changes
