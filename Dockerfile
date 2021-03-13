FROM golang:1.16
WORKDIR /src/back
COPY . /src
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o goodtalk

FROM node:alpine
WORKDIR /src/front
COPY . /src
RUN npm i && npm run build

FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=0 /src/back/goodtalk /src/back/
COPY --from=1 /src/front/public /src/front/public
EXPOSE 8080
WORKDIR /src/back
CMD ["./goodtalk"]
