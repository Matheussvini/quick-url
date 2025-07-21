#!/bin/sh

# Encerra o script se qualquer comando falhar
set -e

# Pega a porta fornecida pelo Render. Se não existir, usa 8000 como padrão.
LISTEN_PORT=${PORT:-8000}

# Exporta as variáveis para o Kong usar
# O Kong vai escutar na porta que o Render espera
export KONG_PROXY_LISTEN="0.0.0.0:$LISTEN_PORT"
export KONG_ADMIN_LISTEN="0.0.0.0:8001" # Mantém a porta de admin interna

# Define o arquivo de configuração processado
PROCESSED_KONG_CONFIG="/tmp/kong.yml"
export KONG_DECLARATIVE_CONFIG=$PROCESSED_KONG_CONFIG

# Substitui APENAS as variáveis especificadas no arquivo de configuração
# Isso evita substituir acidentalmente outras strings que pareçam com variáveis
envsubst '${KONG_USERS_API_URL} ${KONG_URLS_API_URL}' < /etc/kong/kong.yml > $PROCESSED_KONG_CONFIG

# Inicia o Kong com os parâmetros corretos
# 'exec' substitui o processo do shell pelo do Kong, o que é uma boa prática
exec kong start