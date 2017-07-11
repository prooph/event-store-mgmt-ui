<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreConfiguration;

use Prooph\EventStoreMgmtUi\Messaging\DomainEvent;
use Prooph\EventStoreMgmtUi\Messaging\Payload;
use Prooph\EventStoreMgmtUi\Model\Configuration\ConfigurationId;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreName;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreUri;

const addStore = __NAMESPACE__ . '/addStore';
function addStore(ConfigurationId $id, EventStoreUri $uri, EventStoreName $name): array {
    return [
        DomainEvent::eventStoreConfigurationAdded($id, $uri, $name)
    ];
}

const apply = __NAMESPACE__ . '/apply';
function apply(array $state, DomainEvent $event): array {
    switch ($event->messageName()) {
        case DomainEvent::EVENT_STORE_CONFIG_ADDED:
            return [
                Payload::CONFIGURATION_ID => $event->{Payload::CONFIGURATION_ID},
                Payload::EVENT_STORE_URI => $event->{Payload::EVENT_STORE_URI},
                Payload::EVENT_STORE_NAME => $event->{Payload::EVENT_STORE_NAME},
                Payload::VERSION => $event->{Payload::VERSION},
            ];
            break;
        default:
            throw new \LogicException("Unknown event: " . $event->messageName());
    }
}
