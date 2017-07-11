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

namespace Prooph\EventStoreMgmtUi\Config;

use bitExpert\Disco\Annotations\Bean;
use bitExpert\Disco\Annotations\Configuration;
use bitExpert\Disco\Annotations\Parameter;
use bitExpert\Disco\Annotations\Alias;
use bitExpert\Disco\BeanFactoryRegistry;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Prooph\Common\Event\ProophActionEventEmitter;
use Prooph\EventStore\EventStore;
use Prooph\EventStore\Pdo\PersistenceStrategy;
use Prooph\EventStore\Pdo\PostgresEventStore;
use Prooph\EventStore\Pdo\Projection\PostgresProjectionManager;
use Prooph\EventStore\Projection\ProjectionManager;
use Prooph\EventStore\TransactionalActionEventEmitterEventStore;
use Prooph\EventStoreMgmtUi\Infrastructure\Logger\PsrErrorLogger;
use Prooph\EventStoreMgmtUi\Messaging\EventFactory;
use Psr\Log\LoggerInterface;
use Zend\Diactoros\Response;
use Zend\Stratigility\Middleware\ErrorHandler;
use Zend\Stratigility\Middleware\ErrorResponseGenerator;

/**
 * Class AppConfiguration
 *
 * @package App\Config
 * @Configuration
 */
class AppConfiguration
{
    /**
     * @Bean({
     *     "parameters"={
     *       @Parameter({"name" = "config"})
     *     }
     * })
     * @param array $config
     * @return array
     */
    protected function config(array $config): array
    {
        return $config;
    }

    /**
     * @Bean({
     *  "parameters"={
     *    @Parameter({"name" = "config.pdo.dsn"}),
     *    @Parameter({"name" = "config.pdo.user"}),
     *    @Parameter({"name" = "config.pdo.pwd"})
     *   }
     * })
     * @param string $dsn
     * @param string $user
     * @param string $pwd
     * @return \PDO
     */
    public function pdoConnection(string $dsn = '', string $user = '', string $pwd = ''): \PDO
    {
        return new \PDO($dsn, $user, $pwd);
    }

    /**
     * @Bean
     * @return PersistenceStrategy
     */
    protected function eventStorePersistenceStrategy(): PersistenceStrategy
    {
        return new PersistenceStrategy\PostgresAggregateStreamStrategy();
    }

    /**
     * @Bean({
     *   "aliases"={
     *     @Alias({"type" = true}),
     *   }
     * })
     * @return EventStore
     */
    public function eventStore(): EventStore
    {
        //@TODO Set up snapshot store that uses payload factory for aggregate state
        $eventStore = new PostgresEventStore(
            $this->eventFactory(),
            $this->pdoConnection(),
            $this->eventStorePersistenceStrategy()
        );

        return new TransactionalActionEventEmitterEventStore(
            $eventStore,
            new ProophActionEventEmitter(TransactionalActionEventEmitterEventStore::ALL_EVENTS)
        );
    }

    /**
     * @Bean({
     *   "aliases"={
     *     @Alias({"type" = true}),
     *   }
     * })
     * @return EventFactory
     */
    public function eventFactory(): EventFactory
    {
        return new EventFactory();
    }

    /**
     * @Bean({
     *   "aliases"={
     *     @Alias({"type" = true})
     *   }
     * })
     * @return ProjectionManager
     */
    public function projectionManager(): ProjectionManager
    {
        return new PostgresProjectionManager(
            $this->eventStore(),
            $this->pdoConnection()
        );
    }

    /**
     * @Bean({
     *  "parameters"={
     *    @Parameter({"name" = "config.environment"})
     *   }
     * })
     * @param string $environment
     * @return ErrorHandler
     */
    public function httpErrorHandler($environment = 'prod'): ErrorHandler
    {
        $errorHandler = new ErrorHandler(
            new Response(),
            new ErrorResponseGenerator($environment === 'dev')
        );

        $errorHandler->attachListener(new PsrErrorLogger($this->logger()));

        return $errorHandler;
    }

    /**
     * @Bean(
     *   {"aliases"={
     *     @Alias({"type" = true})
     *   }
     * })
     * @return LoggerInterface
     */
    public function logger(): LoggerInterface
    {
        $streamHandler = new StreamHandler('php://stderr');

        return new Logger([$streamHandler]);
    }
}
