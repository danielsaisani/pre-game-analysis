#!/bin/bash

stop-dev() {
    docker compose down
}

dev() {
    stop-dev
    docker compose up -d
}

case "$1" in
    stop-dev)
        stop-dev
        ;;
    dev)
        dev
        ;;
    *)
        echo "Usage: $0 {stop-dev|dev}"
        exit 1
        ;;
esac