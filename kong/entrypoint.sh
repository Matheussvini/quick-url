#!/bin/sh
set -e

envsubst < /etc/kong/kong.yml > /tmp/kong.yml

exec kong start
