#!/bin/sh

# Substitui os placeholders do kong.yml pelas variáveis de ambiente
envsubst < /etc/kong/kong.yml > /etc/kong/kong.generated.yml

# Inicia o Kong com o novo arquivo gerado
exec kong start --conf /etc/kong/kong.conf.default --vv --declarative-config=/etc/kong/kong.generated.yml
#!/bin/sh

# Substitui variáveis de ambiente no kong.yml
envsubst < /etc/kong/kong.yml > /tmp/kong.yml

# Define variáveis necessárias para modo DB-less
export KONG_DATABASE=off
export KONG_DECLARATIVE_CONFIG=/tmp/kong.yml

# Inicia o Kong
exec kong start
