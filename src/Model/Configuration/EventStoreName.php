<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Prooph\EventStoreMgmtUi\Model\Configuration;

final class EventStoreName
{
    /**
     * @var string
     */
    private $name;

    public static function fromString(string $name): EventStoreName
    {
        return new self($name);
    }

    private function __construct(string $name)
    {
        if(empty($name)) {
            throw new \InvalidArgumentException("EventStore name should not be empty");
        }

        $this->name = $name;
    }

    public function toString(): string
    {
        return $this->name;
    }
}
