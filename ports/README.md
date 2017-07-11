# Ports

A port can be invoked by cli script, http middleware, message queue consumer, ...

## How does it work?

The concept of a port is simple. No matter what input channel is used, a port always takes a message array
set up environment to handle the message and returns:
`[\Throwable|null, bool]`

## Usage

A port assumes that autoloading and app container (PSR-11) are set up.
The incoming message (raw array) and the container are passed to the port function returned
by the port. The function is called from the environment which should also handle
port result appropriate.

```php
$port = function(array $message, ContainerInterface $container): array {
    //handle $message
    return [$errorOrNull, $succcess];
}

return $port;
```