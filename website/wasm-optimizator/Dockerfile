FROM rust:latest

RUN cargo install --git https://github.com/gear-tech/gear wasm-proc

RUN mkdir /wasm-build

RUN mkdir -p /usr/local/lib/nodejs
RUN tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs 

WORKDIR /server
COPY . .

CMD [ "npm start" ]