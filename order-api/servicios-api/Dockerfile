# Usamos una imagen ligera de Node
FROM node:18-alpine

#Creamos directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app


COPY app/package*.json ./

#Instalamos dependencias
RUN npm install

#Copiamos el resto del código
COPY app/ .

EXPOSE 3000

#Comandos para iniciar
CMD ["node", "index.js"]