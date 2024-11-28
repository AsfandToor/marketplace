FROM rabbitmq:3-management

ENV RABBITMQ_DEFAULT_USER=user \
    RABBITMQ_DEFAULT_PASS=password

EXPOSE 5672 15672

CMD ["rabbitmq-server"]
