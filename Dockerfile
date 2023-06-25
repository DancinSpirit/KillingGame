#Killing Game Dockerfile
FROM node:19
WORKDIR /app
COPY . /app
RUN npm install
ENV PORT 11037
EXPOSE 11037
CMD ["npm","start"]
