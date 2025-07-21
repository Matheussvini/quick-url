FROM kong:3.9.1

USER root
COPY kong/entrypoint.sh /usr/local/bin/kong-entrypoint.sh
RUN chmod +x /usr/local/bin/kong-entrypoint.sh
USER kong

COPY kong/kong.yml /etc/kong/kong.yml

ENTRYPOINT ["/usr/local/bin/kong-entrypoint.sh"]
