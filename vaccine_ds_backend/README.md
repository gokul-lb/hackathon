# Introduction

This is a very simple "Hello World" style application for Cloudstate.

The intent is to provide a minimal introduction to Cloudstate and Akka Serverless.

We'll build something more interesting later in the course.

# Requirements

To work with this application, you will need the following:

- [NPM](https://www.npmjs.com/get-npm)
- [Docker](https://docs.docker.com/get-docker/)
- [grpcurl](https://github.com/fullstorydev/grpcurl)
- [Akka Serverless CLI (akkasls)](https://docs.cloudstate.com/getting-started/set-up-development-env.html#_cloudstate_cli)
- [A Dockerhub Account](https://hub.docker.com/)

# Command Reference

## Install Dependencies

```
npm install
```

## Docker

### Login

```
docker login
```

### Build and tag Docker image

```
docker build -t <your-dockerhub-username>/hello-world:latest .
```

### Push to Docker Hub

```
docker push <your-dockerhub-username>/hello-world:latest
```

## Akka Serverless

### Login

```
akkasls auth login
```

### Create a project

```
akkasls project new lightbend-training "Services for Lightbend Academy Training"
```

### List projects

```
akkasls projects list
```

### Set the active project

```
akkasls config set project lightbend-training
```

### Deploy a service

```
akkasls svc deploy hello-world <your-dockerhub-username>/hello-world:latest
```

### Verify the service is running

```
akkasls svc list

NAME          AGE  REPLICAS   STATUS   DESCRIPTION
hello-world   2m   1          Ready
```

### Get details of the service

```
akkasls svc get hello-world
```

### Expose the service

```
akkasls svc expose hello-world --enable-cors
```

### Unexpose the service

```
akkasls svc unexpose hello-world <your-service's-URL>
```

### Undeploy the service

```
akkasls svc undeploy hello-world
```

## Testing

### Running Unit/Integration Tests

```
npm test
```

### Test the Service (GRPC)

```
grpcurl -d '{"user_id":"<someId>","name":"<someName>"}' <your-service's-URL>:443 com.example.helloworld.HelloWorld/SayHello
```

### Run the Client

```
node client.js <your-service's-URL> <someId> <someName>
```

## Running Locally

### Run the Service

```
docker run -it --rm --name hello-world -p 8080:8080 -v `pwd`/logs:/var/log <your-dockerhub-username>/hello-world:latest
```

### Run the Proxy

```
docker run -it --rm --name hello-world-proxy -p 9000:9000 --env USER_FUNCTION_HOST=host.docker.internal cloudstateio/cloudstate-proxy-dev-mode:latest
```