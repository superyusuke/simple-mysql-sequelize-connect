#!/usr/bin/env bash
docker run --name db --env MYSQL_RANDOM_ROOT_PASSWORD=true \
    --env MYSQL_USER=user --env MYSQL_PASSWORD=pass \
    --env MYSQL_DATABASE=test \
    --network db_net mysql/mysql-server:5.7
