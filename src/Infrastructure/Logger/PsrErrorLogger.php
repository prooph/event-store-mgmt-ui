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

namespace Prooph\EventStoreMgmtUi\Infrastructure\Logger;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;

final class PsrErrorLogger
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Acts as a Zend\Stratigility\Middleware\ErrorHandler::attachListener() listener
     *
     * @param \Throwable $error
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     */
    public function __invoke(\Throwable $error, ServerRequestInterface $request, ResponseInterface $response)
    {
        $id = uniqid('request_');
        $this->logger->info('Request ('.$id.'): [' . $request->getMethod() . '] ' . $request->getUri());
        $this->logger->info('Request-Headers ('.$id.'): ' . json_encode($request->getHeaders()));
        $this->logger->info('Request-Body ('.$id.'): ' . $request->getBody());
        $this->logger->error('Error ('.$id.'): ' . $error);
    }
}

