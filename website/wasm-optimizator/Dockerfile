FROM rust:latest

RUN cargo install --git https://github.com/gear-tech/gear wasm-proc

RUN mkdir /wasm-build

RUN apt-get install curl
RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash
RUN apt-get install -y nodejs

WORKDIR /server
COPY . .
RUN npm install
RUN ls
CMD [ "node /server/src/main.js" ]