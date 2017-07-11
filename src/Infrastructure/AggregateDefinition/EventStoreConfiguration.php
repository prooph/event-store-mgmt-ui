<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Prooph\EventStoreMgmtUi\Infrastructure\AggregateDefinition;

use Prooph\Common\Messaging\Message;
use Prooph\EventStore\StreamName;
use Prooph\EventStoreMgmtUi\Messaging\Payload;
use Prooph\Micro\AbstractAggregateDefiniton;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreConfiguration as EventStoreConfigurationAggregate;

final class EventStoreConfiguration extends AbstractAggregateDefiniton
{
    public function identifierName(): string
    {
        return Payload::CONFIGURATION_ID;
    }

    public function aggregateType(): string
    {
        return 'Configuration.EventStore';
    }

    public function streamName(): StreamName
    {
        return new StreamName('config');
    }

    public function hasOneStreamPerAggregate(): bool
    {
        return true;
    }

    public function apply(array $state, Message ...$events): array
    {
        foreach ($events as $event) {
            /* @var \Prooph\EventStoreMgmtUi\Messaging\DomainEvent $event */
            $state = EventStoreConfigurationAggregate\apply($state, $event);
        }

        return $state;
    }
}