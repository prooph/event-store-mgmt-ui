<?php
/**
 * This file is part of the prooph/event-store-mgmt-ui.
 * (c) 2014-2017 prooph software GmbH <contact@prooph.de>
 * (c) 2015-2017 Sascha-Oliver Prolic <saschaprolic@googlemail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


//@TODO cache all functions in a single file for production
$srcDirIterator = new RecursiveDirectoryIterator(__DIR__ . "/src");
$recursiveDirIterator = new RecursiveIteratorIterator($srcDirIterator, RecursiveIteratorIterator::SELF_FIRST);

$portsDirIterator = new DirectoryIterator(__DIR__ . "/ports");

$appendIterator = new AppendIterator();

$appendIterator->append($recursiveDirIterator);
$appendIterator->append($portsDirIterator);


foreach ($appendIterator as $file) {
    /* @var SplFileInfo $file */
    if(!$file->isFile()) {
        continue;
    }

    if(substr($file->getFilename(), -9) === ".func.php") {
        require_once $file->getPathname();
    }
}