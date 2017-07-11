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

interface Payload
{
    public const VERSION = 'version';
    public const CONFIGURATION_ID = 'configurationId';
    public const EVENT_STORE_URI = 'eventStoreUri';
    public const EVENT_STORE_NAME = 'eventStoreName';


    public function toArray(): array;
}
