#FROM node:21-slim AS base
#ENV PNPM_HOME="/pnpm"
#ENV PATH="$PNPM_HOME:$PATH"
#RUN corepack enable
#COPY . ./frontend
#WORKDIR ./frontend
#CMD [ "pnpm", "build" ]


#FROM base AS prod-deps
#RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

#FROM base
#COPY --from=prod-deps /frontend/node_modules /frontend/node_modules
#EXPOSE 3000
#CMD [ "pnpm", "start" ]


FROM node:20
WORKDIR /app
COPY . ./
RUN npm i
EXPOSE 3000
CMD [ "npm" , "start" ]
