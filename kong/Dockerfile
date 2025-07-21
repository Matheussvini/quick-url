FROM kong:3.9.1

USER root

# Instala envsubst (vem com gettext)
RUN apk add --no-cache gettext

# Copia entrypoint e garante que é executável
COPY kong/entrypoint.sh /usr/local/bin/kong-entrypoint.sh
RUN chmod +x /usr/local/bin/kong-entrypoint.sh

# Copia arquivo de configuração declarativa
COPY kong/kong.yml /etc/kong/kong.yml

# Volta para usuário padrão
USER kong

ENTRYPOINT ["/usr/local/bin/kong-entrypoint.sh"]
