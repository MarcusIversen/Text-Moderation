FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . ./server
WORKDIR ./server

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base
COPY --from=prod-deps /server/node_modules /server/node_modules
EXPOSE 3000
CMD [ "pnpm" , "start" ]
