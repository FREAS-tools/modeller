FROM node:20.12.2-slim as base

FROM base as build

RUN apt-get update -y
RUN apt-get install git -y

WORKDIR /app
COPY . .

# Install and link freas-bpmn4frss-library
RUN git clone https://github.com/FREAS-tools/freas-bpmn4frss-library.git
WORKDIR /app/freas-bpmn4frss-library/src
RUN npm install
RUN npm link

WORKDIR /app
RUN npm install
RUN npm link freas-bpmn4frss-library

FROM base as final

ENV VITE_PORT=8080
ENV VITE_HOST=0.0.0.0

WORKDIR /app
COPY --from=build /app /app

# Fix the link
WORKDIR /app/freas-bpmn4frss-library/src
RUN npm link
WORKDIR /app
RUN npm link freas-bpmn4frss-library

RUN chown -R node:node /app

USER node

CMD [ "npm", "start"]