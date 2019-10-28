#!/usr/bin/env bash
docker run -p 3333:3333 -it --name server --net=db_net node/server
