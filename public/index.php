<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types = 1);

use Psr\Http\Message\ServerRequestInterface as Request;
use Interop\Http\ServerMiddleware\DelegateInterface as Delegate;

$root = realpath(dirname(__DIR__));

require $root . '/vendor/autoload.php';

/** @var \Psr\Container\ContainerInterface $container */
$container = include $root . '/config/container.php';

$portWhitelist = [
    'add_event_store_config',
];

$app = new \Zend\Stratigility\MiddlewarePipe();

$app->pipe($container->get('httpErrorHandler'));

$app->pipe(new \Zend\Expressive\Helper\BodyParams\BodyParamsMiddleware());

$app->pipe('/api/v1/messagebox', function(Request $request, Delegate $delegate) use ($portWhitelist, $root, $container) {
    $port = substr($request->getUri()->getPath(), 1);
    if(!in_array($port, $portWhitelist)) {
        return new \Zend\Diactoros\Response\EmptyResponse(404);
    }

    $message = $request->getParsedBody();

    $port = include $root . '/ports/' . $port . '.func.php';

    list($error, $success) = $port($message, $container);

    if($error instanceof \Throwable) {
        throw $error;
    }

    if(!$success) {
        return new \Zend\Diactoros\Response\TextResponse((string)$error, 500);
    }

    return new \Zend\Diactoros\Response\EmptyResponse(202);
});

$server = \Zend\Diactoros\Server::createServer(
    $app,
    $_SERVER,
    $_GET,
    $_POST,
    $_COOKIE,
    $_FILES
);

$server->listen(new \Zend\Stratigility\NoopFinalHandler());