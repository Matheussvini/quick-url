# Use a imagem base do Kong
FROM kong:3.9.1

# Certifique-se de que o usuário seja root para instalar pacotes
USER root

# Instale gettext-base para usar envsubst
RUN apt-get update && \
    apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*

# Copie o template do kong.yml primeiro, antes do entrypoint
COPY kong/kong.yml /tmp/kong.yml.template

# Copie o script de entrypoint e dê permissão de execução
COPY kong/entrypoint.sh /usr/local/bin/kong-entrypoint.sh
RUN chmod +x /usr/local/bin/kong-entrypoint.sh

# Alterne de volta para o usuário 'kong' padrão para segurança
USER kong

# Defina o entrypoint do contêiner para o seu script
ENTRYPOINT ["/usr/local/bin/kong-entrypoint.sh"]