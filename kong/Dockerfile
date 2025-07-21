FROM kong:3.9.1

WORKDIR /usr/local/kong

COPY kong/kong.yml /etc/kong/kong.yml
COPY kong/entrypoint.sh /usr/local/kong/entrypoint.sh

RUN chmod +x /usr/local/kong/entrypoint.sh

ENTRYPOINT ["/usr/local/kong/entrypoint.sh"]
