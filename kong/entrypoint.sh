#!/bin/sh

# Substitui variáveis de ambiente no kong.yml
envsubst < /etc/kong/kong.yml > /tmp/kong.yml

# Define variáveis necessárias para modo DB-less
export KONG_DATABASE=off
export KONG_DECLARATIVE_CONFIG=/tmp/kong.yml

# Inicia o Kong
exec kong start
