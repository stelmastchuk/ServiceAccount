FROM node:14
WORKDIR /app

RUN apt-get update && \
    apt-get install curl -y && \
    apt-get install -y python-pip && \
    apt-get install -y zip && \
    pip install awscli