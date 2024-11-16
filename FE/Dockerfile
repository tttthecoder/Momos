
FROM node:20


WORKDIR /fe_app

COPY package*.json ./


# I could do it better, but need to research more instead of forcing!
RUN npm install -f

COPY ./ ./
RUN [ ! -d .env ] || rm -rf .env
ARG NEXT_PUBLIC_BE_HOST
RUN echo "NEXT_PUBLIC_BE_HOST=${NEXT_PUBLIC_BE_HOST}" > .env

RUN npm run build 

ARG FE_PORT
EXPOSE ${FE_PORT}

CMD [ "npm", "run", "start" ]
