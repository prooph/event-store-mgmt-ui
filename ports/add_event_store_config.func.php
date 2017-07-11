<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Prooph\EventStoreMgmtUi\Port;

use Prooph\EventStore\EventStore;
use Prooph\EventStoreMgmtUi\Messaging\Payload;
use Prooph\EventStoreMgmtUi\Model\Configuration\ConfigurationId;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreConfiguration as EventStoreConfigurationAggregate;
use Prooph\EventStoreMgmtUi\Infrastructure\AggregateDefinition\EventStoreConfiguration;
use Prooph\EventStoreMgmtUi\Messaging\Command;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreName;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreUri;
use Psr\Container\ContainerInterface;

$port = function (array $command, ContainerInterface $container) {
    $commandMap = [
        Command::ADD_EVENT_STORE_CONFIG => [
            'handler' => function(callable $stateResolver, Command $addEventStoreConfig): array {
                return EventStoreConfigurationAggregate\addStore(
                    $addEventStoreConfig->{Payload::CONFIGURATION_ID},
                    $addEventStoreConfig->{Payload::EVENT_STORE_URI},
                    $addEventStoreConfig->{Payload::EVENT_STORE_NAME}
                );
            },
            'definition' => EventStoreConfiguration::class,
        ]
    ];

    $addEventStoreConfig = Command::addEventStoreConfiguration(
        ConfigurationId::fromString($command['payload']['configId']),
        EventStoreUri::fromString($command['payload']['storeUri']),
        EventStoreName::fromString($command['payload']['storeName'])
    );

    $dispatch = \Prooph\Micro\Kernel\buildCommandDispatcher(
        $commandMap,
        function() use ($container): EventStore {
            return $container->get(EventStore::class);
        }
    );

    $result = $dispatch($addEventStoreConfig);

    if($result instanceof \Throwable) {
        return [$result, false];
    }

    return [null, true];
};

return $port;