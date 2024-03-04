FROM node:14-alpine as development

ENV CHROME_BIN="/usr/bin/chromium-browser"\
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN set -x \
  && apk update \
  && apk upgrade \
  # replacing default repositories with edge ones
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  \
  # Add the packages
  && apk add --no-cache dumb-init curl make gcc g++ python3 linux-headers binutils-gold gnupg libstdc++ nss chromium \
  \
  # Do some cleanup
  && apk del --no-cache make gcc g++ python3 binutils-gold gnupg libstdc++ \
  && rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
  && echo

# Create app directory
#RUN mkdir -p /usr/src/app
#WORKDIR /usr/src/app

# Install app dependencies
#COPY package.json /usr/src/app/
#COPY tsconfig.build.json /usr/src/app/
#COPY tsconfig.json /usr/src/app/
COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .

RUN npm install
RUN npm run build

# Bundle app source
#COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "run start:prod" ]