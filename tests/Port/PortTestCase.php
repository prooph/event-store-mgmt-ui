<?php
declare(strict_types = 1);

namespace Prooph\EventStoreMgmtUiTest\Port;

use PHPUnit\Framework\TestCase;
use Prooph\Common\Event\ActionEvent;
use Prooph\Common\Event\ProophActionEventEmitter;
use Prooph\EventStore\ActionEventEmitterEventStore;
use Prooph\EventStore\EventStore;
use Prooph\EventStore\InMemoryEventStore;
use Psr\Container\ContainerInterface;

class PortTestCase extends TestCase
{
    /**
     * @var EventStore
     */
    protected $eventStore;

    private $recordedEvents = [];

    protected function setUp()
    {
        $this->recordedEvents = [];
        $this->eventStore = new ActionEventEmitterEventStore(
            new InMemoryEventStore(),
            new ProophActionEventEmitter(ActionEventEmitterEventStore::ALL_EVENTS)
        );

        $this->eventStore->attach(
            ActionEventEmitterEventStore::EVENT_APPEND_TO,
            function (ActionEvent $event): void {
                $recordedEvents = $event->getParam('streamEvents', new \ArrayIterator());
                $this-> recordedEvents = array_merge($this->recordedEvents, iterator_to_array($recordedEvents));
            }
        );

        $this->eventStore->attach(
            ActionEventEmitterEventStore::EVENT_CREATE,
            function (ActionEvent $event): void {
                $stream = $event->getParam('stream');
                $recordedEvents = $stream->streamEvents();
                $this-> recordedEvents = array_merge($this->recordedEvents, iterator_to_array($recordedEvents));
            }
        );
    }

    protected function loadPort(string $port): callable
    {
        $root = realpath(dirname(dirname(__DIR__)));

        return include $root . '/ports/' . $port . '.func.php';
    }

    protected function createMessage(string $messageName, array $payload = []) {
        return [
            'message_name' => $messageName,
            'payload' => $payload
        ];
    }

    protected function recordedEvents(): array
    {
        return $this->recordedEvents;
    }

    protected function getContainer(): ContainerInterface
    {
        $eventStore = $this->eventStore;
        return new class($eventStore) implements ContainerInterface {

            private $eventStore;

            public function __construct(EventStore $eventStore)
            {
                $this->eventStore = $eventStore;
            }

            /**
             * @inheritdoc
             */
            public function get($id)
            {
                switch ($id) {
                    case EventStore::class:
                        return $this->eventStore;
                    default:
                        throw new \RuntimeException("Service not found. Got " . $id);
                }
            }

            /**
             * @inheritdoc
             */
            public function has($id)
            {
                switch ($id) {
                    case EventStore::class:
                        return true;
                    default:
                        return false;
                }
            }
        };
    }
}
