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

use Psr\Http\Message\UriInterface;
use Zend\Diactoros\Uri;

final class EventStoreUri
{
    /**
     * @var UriInterface
     */
    private $uri;

    public static function fromUri(UriInterface $uri): EventStoreUri
    {
        return new self($uri);
    }

    public static function fromString(string $uri): EventStoreUri
    {
        return new self(new Uri($uri));
    }

    private function __construct(UriInterface $uri)
    {
        $this->uri = $uri;
    }

    public function toString(): string
    {
        return (string)$this->uri;
    }
}
