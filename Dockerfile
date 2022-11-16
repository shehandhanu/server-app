# ---- Base Node ----
FROM node:alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies 
COPY package*.json ./
RUN yarn install

# ---- Copy Files/Build ----
FROM dependencies AS build  
WORKDIR /app
COPY . /app
RUN mkdir -p /app/file_storage
RUN yarn build

# --- Release with Alpine ----
FROM node:alpine AS release  
WORKDIR /app
COPY --from=dependencies /app/package.json ./
RUN yarn install --only=production
COPY --from=build /app ./
CMD ["node", "build/index.js"]