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

final class AggregateVersion
{
    private $version = 0;

    public static function first(): AggregateVersion
    {
        return new self(1);
    }

    public static function fromInt(int $version): AggregateVersion
    {
        return new self($version);
    }

    private function __construct(int $version)
    {
        $this->version = $version;
    }

    public function inc(): AggregateVersion
    {
        return new self($this->version + 1);
    }

    public function toInt(): int
    {
        return $this->version;
    }
}
