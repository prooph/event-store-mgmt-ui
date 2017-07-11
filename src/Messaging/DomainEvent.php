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

namespace Prooph\EventStoreMgmtUi\Messaging;

use Prooph\Common\Messaging\DomainEvent as ProophDomainEvent;
use Prooph\EventStoreMgmtUi\Model\Configuration\ConfigurationId;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreName;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreUri;
use Prooph\MicroReloaded\Model\Customer\CustomerId;
use Prooph\MicroReloaded\Model\Order\OrderId;
use Prooph\MicroReloaded\Model\Order\ProductsOrder;
use Prooph\MicroReloaded\Model\Product\ProductList;
use Prooph\MicroReloaded\Model\ProductImporter\JobId;

final class DomainEvent extends ProophDomainEvent
{
    public const EVENT_STORE_CONFIG_ADDED = 'Configuration.EventStoreConfigAdded';

    public static function eventStoreConfigurationAdded(ConfigurationId $id, EventStoreUri $uri, EventStoreName $name): DomainEvent {
        return new self(self::EVENT_STORE_CONFIG_ADDED, $id, $uri, $name, AggregateVersion::first());
    }

    //instance lifecycle -----------------------------------------------------------------------------

    /**
     * @var Payload
     */
    private $payload;

    private function __construct(string $messageName, ...$objs)
    {
        $this->messageName = $messageName;
        $this->payload = PayloadFactory::payloadFromObjects(...$objs);
        $this->init();
    }

    public function __get($name)
    {
        return $this->payload->{$name};
    }

    protected function setPayload(array $payload): void
    {
        $this->payload = PayloadFactory::payloadFromArray($payload);
    }

    public function payload(): array
    {
        return $this->payload->toArray();
    }
}
