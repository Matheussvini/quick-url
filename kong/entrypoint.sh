#!/bin/sh

# Substitui os placeholders do kong.yml pelas variáveis de ambiente
envsubst < /etc/kong/kong.yml > /etc/kong/kong.generated.yml

# Inicia o Kong com o novo arquivo gerado
exec kong start --conf /etc/kong/kong.conf.default --vv --declarative-config=/etc/kong/kong.generated.yml
