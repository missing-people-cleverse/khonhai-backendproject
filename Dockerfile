FROM node:latest

WORKDIR /app

COPY . .

ENV DATABASE_URL="postgresql://postgres:academy@localhost:5432/project?schema=public"
ENV PORT=8000
# ENV POSTGRES_PASSWORD="project"
# ENV AUTH_SECRET="project"
# ENV PORT=8000
# ENV MONGODB_HOST="localhost"
# ENV MONGODB_PORT="27017"
# ENV MONGODB_USERNAME="root"
# ENV MONGODB_PASSWORD="secret"

# RUN npm install -g pnpm
# RUN pnpm install
# RUN pnpm build
RUN npm i
RUN npm run prisma
RUN npm run build


# EXPOSE 8000/TCP

CMD ["node", "dist/index.js"]