FROM node:12.18.4

WORKDIR /usr/src/app

COPY ./composer.json .

RUN yarn
RUN yarn global add expo-cli

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006

# CMD ["yarn", "start"]