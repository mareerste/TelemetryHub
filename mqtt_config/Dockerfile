FROM rabbitmq:4.0.4-management

# Enable the MQTT plugin
RUN rabbitmq-plugins enable --offline rabbitmq_mqtt

# Expose necessary ports
EXPOSE 1883 5672 15672
