FROM golang:1.22
LABEL authors="tfleming"

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /simulator ./cmd/simulator

ENTRYPOINT ["/simulator"]
