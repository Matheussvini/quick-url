#!/bin/sh
set -e

LISTEN_PORT=${PORT:-8000} # O Render injetará 10000 aqui para o Kong

# Não precisa mais de PROCESSED_KONG_CONFIG e envsubst se usar nomes de serviço internos
# O Kong pode ler o kong.yml diretamente de /etc/kong/kong.yml

export KONG_DECLARATIVE_CONFIG="/etc/kong/kong.yml" # Volta a usar o arquivo original
export KONG_ADMIN_LISTEN="0.0.0.0:8001"
export KONG_PROXY_LISTEN="0.0.0.0:$LISTEN_PORT"

exec kong start