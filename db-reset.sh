#!/bin/bash

echo "Stopping the container govkb-postgres..."
docker stop govkb-postgres

echo "Removing the container govkb-postgres..."
docker rm govkb-postgres

echo "Removing the volume govkb_postgres-db..."
docker volume rm govkb_postgres-db
