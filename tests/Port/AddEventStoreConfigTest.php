<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Prooph\EventStoreMgmtUiTest\Port;

use Prooph\EventStoreMgmtUi\Messaging\Command;
use Prooph\EventStoreMgmtUi\Messaging\Payload;
use Ramsey\Uuid\Uuid;

class AddEventStoreConfigTest extends PortTestCase
{
    /**
     * @test
     */
    public function it_adds_event_store_config()
    {
        $port = $this->loadPort('add_event_store_config');

        $configId = Uuid::uuid4()->toString();
        $storeUri = 'https://localhost:8080/eventstore';
        $storeName = 'Test ES';

        $addEventStoreConfig = $this->createMessage(Command::ADD_EVENT_STORE_CONFIG, [
            'configId' => $configId,
            'storeUri' => $storeUri,
            'storeName' => $storeName
        ]);

        list($error, $success) = $port($addEventStoreConfig, $this->getContainer());

        self::assertTrue($success);
        self::assertNull($error);

        $events = $this->recordedEvents();

        self::assertCount(1, $events);

        $event = $events[0];

        self::assertEquals($configId, $event->{Payload::CONFIGURATION_ID}->toString());
        self::assertEquals($storeUri, $event->{Payload::EVENT_STORE_URI}->toString());
        self::assertEquals($storeName, $event->{Payload::EVENT_STORE_NAME}->toString());
    }
}