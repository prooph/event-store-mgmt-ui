# Ports

Ports replace the need for an application service bus and therefor help to simplify the code base and structure of
the backend a lot.

A port can be invoked by cli script, http middleware, message queue consumer, ...
Furthermore, a port can be tested easily. See existing port unit tests of ES-Mgmt-UI.

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

`public/index.php` contains a basic zend/diactoros server set up together with a port handling middleware.
Similar port handling can be seen in `tests/Ports/PortTestCase.php`.

Those two examples should illustrate how easy it is to invoke a port in different environments. 

Imagine how easy it becomes to invoke the same ports from a message queue consumer.

Or how easy it is to split the domain model into smaller pieces (Microservices) later and use an api gateway like Nginx
to route messages to ports.

You can prepare for the future but use a simple set up now to get things done quickly by only spending time on working out
the correct shape of the domain model. Performance optimization, microservices deployment and other time consuming technical tasks
can be delayed to a later point. Make customers and users of the application happy first!