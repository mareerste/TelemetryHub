#!/bin/bash

HOST=$1
PORT=$2
TIMEOUT=${3:-5}

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "Usage: $0 <host> <port> [timeout]"
  exit 1
fi

echo "Waiting for $HOST:$PORT to be ready..."

START=$(date +%s)
while true; do
  if nc -z "$HOST" "$PORT"; then
    echo "$HOST:$PORT is ready!"
    exit 0
  fi

  ELAPSED=$(( $(date +%s) - START ))
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "Timeout reached! $HOST:$PORT is not ready."
    exit 1
  fi

  sleep 1
done
