FROM node:latest

WORKDIR /app

COPY . .

ENV DATABASE_URL="postgresql://postgres:academy@localhost:5432/project?schema=public"
ENV REDIS_URL="redis://redis-cli:6379"

ENV PORT=8000

RUN npm i
RUN npm run prisma
RUN npm run build

CMD ["node", "dist/index.js"]