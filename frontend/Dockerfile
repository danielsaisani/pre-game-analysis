FROM node:18

COPY ./pluto/package.json .

RUN npm install

COPY ./pluto .

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "5173"]