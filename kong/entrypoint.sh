# kong/entrypoint.sh
#!/bin/sh
set -e

# Lê o template de /tmp/kong.yml.template e escreve o resultado em /etc/kong/kong.yml
# Isso garante que o KONG_DECLARATIVE_CONFIG aponte para o arquivo já processado.
envsubst < /tmp/kong.yml.template > /etc/kong/kong.yml

# Inicia o Kong
exec kong start