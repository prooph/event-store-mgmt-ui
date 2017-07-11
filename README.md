# PROOPH EVENT STORE MGMT UI

## Install

```
$ docker run --rm -it -v $(pwd):/app prooph/composer:7.1 install
$ docker-compose up -d
$ docker-compose run node yarn build
```

## Usage

Open http://localhost:8111/ in your browser.

## Work In Progress

The ES-Mgmt-UI is under heavy development. If you are interested you can install it and
explore it of your own. More information is provided later when we have a first working version.

The UI itself is developed using [ELm](http://elm-lang.org/)

The ES-Mgmt-UI also has its own backend to store configuration and later also configurable 
stream views and watch alarms.

The backend uses [prooph/micro](https://github.com/prooph/micro) for the domain model and
[zend/expressive](https://docs.zendframework.com/zend-expressive/) for the read model.

You can find some information about the backend structure in the [docs](docs).
