FROM kong:3.9.1

USER root

# Instala envsubst (gettext-base)
RUN apt-get update && \
    apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*

# Copia entrypoint e torna executável
COPY kong/entrypoint.sh /usr/local/bin/kong-entrypoint.sh
RUN chmod +x /usr/local/bin/kong-entrypoint.sh

# Copia o kong.yml com placeholders
COPY kong/kong.yml /etc/kong/kong.yml

USER kong

ENTRYPOINT ["/usr/local/bin/kong-entrypoint.sh"]
