FROM node:18-buster-slim

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN apt-get update -o Acquire::Check-Valid-Until=false && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* /app/

RUN npm install --legacy-peer-deps

COPY . /app

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
