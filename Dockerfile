FROM node:14-alpine

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json /usr/src/app/
COPY tsconfig.build.json /usr/src/app/
COPY tsconfig.json /usr/src/app/

COPY . .

RUN npm install --force
RUN npm run build

# Bundle app source
COPY . /usr/src/app

EXPOSE 5000

CMD [ "npm", "run", "start:prod" ]