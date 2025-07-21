FROM kong:3.9.1

COPY kong/entrypoint.sh /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh

RUN mv /tmp/entrypoint.sh /usr/local/bin/kong-entrypoint.sh

COPY kong/kong.yml /etc/kong/kong.yml

ENTRYPOINT ["/usr/local/bin/kong-entrypoint.sh"]
