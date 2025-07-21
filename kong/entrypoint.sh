#!/bin/sh

# Encerra o script se qualquer comando falhar
set -e

# Pega a porta fornecida pelo Render. Render sempre injeta a variável PORT.
# Usar 8000 como fallback é uma boa prática, mas o Render DEVE fornecer PORT.
LISTEN_PORT=${PORT:-8000}

# Define o caminho para o arquivo de configuração processado
PROCESSED_KONG_CONFIG="/tmp/kong.yml"

# Substitui as variáveis de ambiente no kong.yml e salva no arquivo temporário.
# É crucial que as variáveis ${KONG_USERS_API_URL} e ${KONG_URLS_API_URL}
# estejam disponíveis no ambiente do contêiner antes deste passo.
envsubst '${KONG_USERS_API_URL} ${KONG_URLS_API_URL}' < /etc/kong/kong.yml > "$PROCESSED_KONG_CONFIG"

# Configura as variáveis de ambiente do Kong.
# Usamos a porta LISTEN_PORT para o proxy, que é a porta do Render.
export KONG_PROXY_LISTEN="0.0.0.0:$LISTEN_PORT"
export KONG_ADMIN_LISTEN="0.0.0.0:8001" # Mantém a porta de admin interna (não exposta externamente no Render, a menos que você configure explicitamente)
export KONG_DECLARATIVE_CONFIG="$PROCESSED_KONG_CONFIG" # Aponta Kong para o arquivo processado

# Estas variáveis já estão nas suas ENV Vars do Render, mas garantir que o Kong as veja.
# KONG_DATABASE=off
# KONG_LOG_LEVEL=debug
# KONG_PROXY_ACCESS_LOG=/dev/stdout
# KONG_PROXY_ERROR_LOG=/dev/stderr
# KONG_ADMIN_ACCESS_LOG=/dev/stdout
# KONG_ADMIN_ERROR_LOG=/dev/stderr

# Inicia o Kong.
# 'exec' substitui o processo do shell pelo do Kong.
exec kong start