# kong/Dockerfile
FROM kong:3.9.1

USER root

# Instala envsubst (via gettext) usando apt
RUN apt-get update && \
    apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*

# Copia entrypoint
COPY kong/entrypoint.sh /usr/local/bin/kong-entrypoint.sh
RUN chmod +x /usr/local/bin/kong-entrypoint.sh

# Copia o kong.yml para ser o template
COPY kong/kong.yml /tmp/kong.yml.template

USER kong

# Define o ENTRYPOINT para o seu script customizado
ENTRYPOINT ["/usr/local/bin/kong-entrypoint.sh"]

# O Kong precisa de um CMD ou o ENTRYPOINT deve invocar o 'start'
# Como o ENTRYPOINT já invoca 'kong start', não precisamos de um CMD aqui.
# A imagem base do Kong já tem um CMD padrão que é "kong docker-start", mas o ENTRYPOINT
# sobrescreve isso, então seu script customizado é o que roda.