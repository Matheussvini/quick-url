#!/bin/sh
set -e

envsubst < /tmp/kong.yml.template > /etc/kong/kong.yml

exec kong start