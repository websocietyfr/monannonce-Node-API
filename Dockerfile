FROM node:16-alpine

#RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
#COPY package.json $HOME/
#RUN chown -R app:app $HOME/*

#USER root
WORKDIR $HOME

#COPY . .

#RUN npm i -g @adonisjs/cli
#RUN npm install
EXPOSE 3333