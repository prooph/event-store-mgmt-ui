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

use Prooph\EventStoreMgmtUi\Model\Common\UuidValueObject;

/**
 * Class ConfigurationId
 * @package Prooph\EventStoreMgmtUi\Model\Configuration
 * @method static ConfigurationId fromString(string $id)
 */
class ConfigurationId
{
    use UuidValueObject;
}
