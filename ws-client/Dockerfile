FROM node:16 as dependencies

LABEL org.opencontainers.image.authors alejandrorodarte1@gmail.com
LABEL org.opencontainers.image.title "Dependencies image for a client websocket frontend application"
LABEL org.opencontainers.image.url https://hub.docker.com/repository/docker/rodarte/nestjs-fr-teslo-ws-client-prod
LABEL org.opencontainers.image.source https://github.com/AlejandroRodarte/nestjs-teslo-shop/tree/master/ws-client
LABEL org.opencontainers.image.licenses MIT

LABEL com.rodarte.nestjs.fr.teslo.ws.client.nodeversion $NODE_VERSION
LABEL com.rodarte.nestjs.fr.teslo.ws.client.stage dependencies

ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

RUN apt-get update \
    && apt-get install tini

ENV PATH /node/node_modules/.bin:$PATH

WORKDIR /node

RUN chown -R node:node .

COPY --chown=node:node package.json yarn.lock ./

RUN yarn \
    && yarn cache clean

ENTRYPOINT [ "/usr/bin/tini", "--" ]


FROM dependencies as dev

LABEL org.opencontainers.image.title "Development image for a client websocket frontend application"

LABEL com.rodarte.nestjs.fr.teslo.ws.client.stage dev

ENV NODE_ENV development
ENV PORT 3001

WORKDIR /node/app

RUN mkdir /node/node_modules/.vite \
    && chown -R node:node /node/node_modules/.vite

USER node

EXPOSE 3001

CMD [ "vite" ]


FROM dependencies as build

LABEL org.opencontainers.image.title "Build image for a client websocket frontend application"

LABEL com.rodarte.nestjs.fr.teslo.ws.client.stage build

COPY --chown=node:node . .

RUN tsc && vite build


FROM nginx:1.23 as prod

LABEL org.opencontainers.image.created $CREATED_DATE
LABEL org.opencontainers.image.revision $SOURCE_COMMIT
LABEL org.opencontainers.image.title "Production image for a client websocket frontend application"

LABEL com.rodarte.nestjs.fr.teslo.ws.client.stage prod

COPY --from=build /node/dist /usr/share/nginx/html

EXPOSE 80
