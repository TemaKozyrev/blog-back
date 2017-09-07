FROM node:7.10
RUN mkdir -p /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
COPY . /app/
EXPOSE 4040
CMD [ "yarn", "start" ]
