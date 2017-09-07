FROM node:6.10.1

MAINTAINER Tema Kozyrev <tema@tema.ws>

RUN mkdir -p /app

WORKDIR /app

ADD package.json yarn.lock /app/

RUN yarn --pure-lockfile

COPY . /app/

# expose port 4040
EXPOSE 4040

CMD [ "yarn", "start" ]
