FROM golang:1.6-alpine
MAINTAINER tobe zhengwanbo@gmail.com

# Install dependency
RUN apk add -U git\
    && go get github.com/astaxie/beego \
    && apk del git \
    && rm -rf /var/cache/apk/* /tmp/*

# Build seagull
Add . /go/src/github.com/zhengwanbo/tidbmonitor/
WORKDIR /go/src/github.com/zhengwanbo/tidbmonitor/
RUN go build seagull.go

# Expose the port
EXPOSE 10086

# Run the server
CMD ["./seagull"]
