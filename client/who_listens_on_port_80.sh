#!/usr/bin/env bash

if [ $UID != 0 ]; then
    echo "use sudo to run this command !"
    exit 1
fi
fuser -u 80/tcp
fuser -u 443/tcp
