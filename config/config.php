<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
declare(strict_types=1);

namespace Prooph\EventStoreMgmtUi\Config;

use Zend\ConfigAggregator\ArrayProvider;
use Zend\ConfigAggregator\ConfigAggregator;
use Zend\ConfigAggregator\PhpFileProvider;

$root = realpath(dirname(__DIR__));

$cacheConfig = [
    'config_cache_path' => $root . '/data/config-cache.php',
];
$aggregator = new ConfigAggregator([
    new ArrayProvider($cacheConfig),
    new PhpFileProvider($root . '/config/autoload/{{,*.}global,{,*.}local}.php'),
    new PhpFileProvider($root . '/config/development.config.php'),
], $cacheConfig['config_cache_path']);
return $aggregator->getMergedConfig();