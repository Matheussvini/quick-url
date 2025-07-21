FROM kong:3.9.1

USER root

# Instala envsubst (via gettext) usando apt
RUN apt-get update && \
    apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*

# Copia entrypoint
COPY kong/entrypoint.sh /usr/local/bin/kong-entrypoint.sh
RUN chmod +x /usr/local/bin/kong-entrypoint.sh

# Copia config
COPY kong/kong.yml /etc/kong/kong.yml

USER kong

ENTRYPOINT ["/usr/local/bin/kong-entrypoint.sh"]
