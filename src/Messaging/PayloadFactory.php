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

use Prooph\EventStoreMgmtUi\Model\Configuration\ConfigurationId;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreName;
use Prooph\EventStoreMgmtUi\Model\Configuration\EventStoreUri;

final class PayloadFactory
{
    private const TYPE_STRING = 1;
    private const TYPE_INT = 2;
    private const TYPE_FLOAT = 3;
    private const TYPE_BOOL = 4;
    private const TYPE_ARRAY = 5;

    public const keyObjMap = [
        Payload::VERSION => [AggregateVersion::class, self::TYPE_INT],
        Payload::CONFIGURATION_ID => [ConfigurationId::class, self::TYPE_STRING],
        Payload::EVENT_STORE_URI => [EventStoreUri::class, self::TYPE_STRING],
        Payload::EVENT_STORE_NAME => [EventStoreName::class, self::TYPE_STRING],
    ];

    public static function payloadFromObjects(...$objs): Payload {

        static $objKeyMap = [];

        if(!count($objKeyMap)) {
            foreach (self::keyObjMap as $key => list($objClass, $type)) {
                $objKeyMap[$objClass] = [$key, $type];
            }
        }

        return new class($objs, $objKeyMap) implements Payload {
            private $objs = [];
            public function __construct(array $objs, array $objKeyMap)
            {
                foreach ($objs as $obj) {
                    $objClass = get_class($obj);
                    if(!isset($objKeyMap[$objClass])) {
                        throw new \InvalidArgumentException(
                            "Unknown object passed to payload factory. Did you forget to add it to PayloadFactory::keyObjMap? Got " . $objClass
                        );
                    }
                    list($key) = $objKeyMap[$objClass];
                    $this->objs[$key] = $obj;
                }
            }

            public function __get($name)
            {
                if(!array_key_exists($name, $this->objs)) {
                    throw new \BadMethodCallException('Payload does not contain an object assigned to key: ' . $name);
                }

                return $this->objs[$name];
            }

            public function toArray(): array
            {
                $payload = [];

                foreach ($this->objs as $key => $obj) {
                    list(,$type) = PayloadFactory::keyObjMap[$key];

                    $payload[$key] = PayloadFactory::convertObjToType($obj, $type);
                }

                return $payload;
            }
        };
    }
    const payloadFromObjects = [__CLASS__, 'payloadFromObjects'];

    public static function payloadFromArray(array $payload): Payload
    {
        $objs = [];

        foreach ($payload as $key => $objVal) {
            if(!array_key_exists($key, self::keyObjMap)) {
                throw new \InvalidArgumentException('Unknown key found in payload. Got ' . $key);
            }

            list($class, $type) = self::keyObjMap[$key];

            $objs[] = self::createObjFromTypeValue($objVal, $type, $class);
        }

        return self::payloadFromObjects(...$objs);
    }
    const payloadFromArray = [__CLASS__, 'payloadFromArray'];

    public static function convertObjToType($obj, int $type)
    {
        switch ($type) {
            case self::TYPE_STRING:
                return $obj->toString();
            case self::TYPE_INT:
                return $obj->toInt();
            case self::TYPE_FLOAT:
                return $obj->toFloat();
            case self::TYPE_BOOL:
                return $obj->toBool();
            Case self::TYPE_ARRAY:
                return $obj->toArray();
            default:
                throw new \BadMethodCallException("Unknown type. Got " . $type);
        }
    }
    const convertObjToType = [__CLASS__, 'convertObjToType'];

    public static function createObjFromTypeValue($value, int $type, string $class)
    {
        switch ($type) {
            case self::TYPE_STRING:
                return $class::fromString($value);
            case self::TYPE_INT:
                return $class::fromInt($value);
            case self::TYPE_FLOAT:
                return $class::fromFloat($value);
            case self::TYPE_BOOL:
                return $class::fromBool($value);
            Case self::TYPE_ARRAY:
                return $class::fromArray($value);
            default:
                throw new \BadMethodCallException("Unknown type. Got " . $type);
        }
    }
    const createObjFromTypeValue = [__CLASS__, 'createObjFromTypeValue'];
}
