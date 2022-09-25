FROM node:16 as base

LABEL org.opencontainers.image.authors alejandrorodarte1@gmail.com
LABEL org.opencontainers.image.title "Base image for a products store nest.js application"
LABEL org.opencontainers.image.url https://hub.docker.com/repository/docker/rodarte/nestjs-fr-teslo-shop-prod
LABEL org.opencontainers.image.source https://github.com/AlejandroRodarte/nestjs-teslo-shop/tree/master/teslo-shop
LABEL org.opencontainers.image.licenses MIT

LABEL com.rodarte.nestjs.fr.teslo.shop.nodeversion $NODE_VERSION
LABEL com.rodarte.nestjs.fr.teslo.shop.stage base

ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

ENV NODE_ENV production
ENV PORT 3000

RUN apt-get update \
    && apt-get install tini

ENV PATH /node/node_modules/.bin:$PATH

WORKDIR /node

RUN chown -R node:node .

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --production=true \
    && yarn cache clean

EXPOSE 3000

ENTRYPOINT [ "/usr/bin/tini", "--" ]


FROM base as base-dev

LABEL org.opencontainers.image.title "Base development image for a products store nest.js application"

LABEL com.rodarte.nestjs.fr.teslo.shop.stage base-dev

RUN yarn install --production=false \
    && yarn cache clean


FROM base-dev as dev

LABEL org.opencontainers.image.title "Development image for a products store nest.js application"

LABEL com.rodarte.nestjs.fr.teslo.shop.stage dev

ENV NODE_ENV development

WORKDIR /node/app

HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT}/api/v2/health/healthz || exit 1

USER node

CMD [ "nest", "start", "--watch" ]


FROM base-dev as source

LABEL org.opencontainers.image.title "Source image for a products store nest.js application"

LABEL com.rodarte.nestjs.fr.teslo.shop.stage source

COPY --chown=node:node . .


FROM source as build

LABEL org.opencontainers.image.title "Build image for a products store nest.js application"

LABEL com.rodarte.nestjs.fr.teslo.shop.stage build

RUN nest build


FROM base as prod

LABEL org.opencontainers.image.created $CREATED_DATE
LABEL org.opencontainers.image.revision $SOURCE_COMMIT
LABEL org.opencontainers.image.title "Production image for a products store nest.js application"

LABEL com.rodarte.nestjs.fr.teslo.shop.stage prod

COPY --chown=node:node --from=build /node/dist ./dist
COPY --chown=node:node --from=build /node/public ./public

HEALTHCHECK --interval=10s --timeout=10s --start-period=10s --retries=3 CMD curl -f http://localhost:${PORT}/api/v2/health/healthz || exit 1

USER node

CMD [ "node", "dist/main.js" ]
