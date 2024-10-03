# FROM ghcr.io/puppeteer/puppeteer:23.4.1

# # WORKDIR /usr/src/app

# WORKDIR /

# COPY package*.json ./
# RUN npm ci
# COPY . .

# CMD [ "node", "server.js" ]






# FROM ghcr.io/puppeteer/puppeteer:23.4.1

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm ci

# # Create user_data directory and set permissions
# RUN mkdir -p /usr/src/app/user_data && chmod -R 777 /usr/src/app/user_data

# COPY . .

# CMD ["node", "server.js"]




FROM node:18

# Set the working directory
WORKDIR /app

# Install the chromium browser and its dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget

# Copy package.json and package-lock.json files


COPY package*.json ./
RUN npm ci
COPY . .

CMD [ "node", "server.js" ]