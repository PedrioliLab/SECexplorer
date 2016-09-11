#!/usr/bin/env bash

if [ $UID != 0 ]; then
    echo "use sudo to run this command !"
    exit 1
fi
fuser 80/tcp
