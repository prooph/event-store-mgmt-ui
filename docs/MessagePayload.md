# Message Payload

A [port](Ports.md) is responsible for translating a raw message array into a message that the domain model
can understand. In the ES-Mgmt-UI are two central classes used to describe messages:

- `src/Messaging/Command`
- `src/Messaging/DomainEvent`

Both work the same way. Message names are defined as constants in the class.
Messages are created by static factory methods provided by the classes.

An `Configuration.AddEventStoreConfig` command for example is created like this:

```php
$addEventStoreConfig = Command::addEventStoreConfiguration(
    ConfigurationId::fromString($command['payload']['configId']),
    EventStoreUri::fromString($command['payload']['storeUri']),
    EventStoreName::fromString($command['payload']['storeName'])
);
```

The example also illustrates that we use value objects for every payload property.

Those value objects are configured in `src/Messaging/PayloadFactory` and have a matching
payload key constant in `src/Messaging/Payload`.

This means that input validation is completely handled by value objects. No value in the domain model
has an unknown shape. Furthermore, type configuration in the `PayloadFactory` enables direct
value object access from domain messages. Serialization and deserialization is handled by the PayloadFactory
automatically.

PayloadFactory will also be used for aggregate state as soon as we add snapshots and need to serialize/deserialize
aggregate state.



