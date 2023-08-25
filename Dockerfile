FROM node:18-alpine
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN yarn
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start:prod" ]