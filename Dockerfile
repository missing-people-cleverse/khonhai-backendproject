FROM node:latest

WORKDIR /app

COPY . .

ENV DATABASE_URL="postgresql://postgres:academy@localhost:5432/project?schema=public"
ENV REDIS_URL="redis://redis-cli:6379"

ENV PORT=8000
# ENV POSTGRES_PASSWORD="project"
# ENV AUTH_SECRET="project"
# ENV PORT=8000


# RUN npm install -g pnpm
# RUN pnpm install
# RUN pnpm build
RUN npm i
RUN npm run prisma
RUN npm run build


# EXPOSE 8000/TCP

CMD ["node", "dist/index.js"]