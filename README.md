# Docker Infrastructure CLI

Command line tool to quickly spin up infrastracture using docker for local development

## Installation

Yarn:

```bash
yarn global add @zource/di
```

NPM:

```bash
npm install -g  @zource/di
```

## Requirement

Please install [docker-desktop or docker engine](https://docs.docker.com/get-docker/)

## Help

```bash
di --help
```

```bash
Usage: di [options] [command]

Docker Infrastructure CLI

Options:
  -v, --version                    output the version number
  -h, --help                       display help for command

Commands:
  list                             list all available services
  config [options] [path] [value]  show/update config
  start [options] [services...]    starts services
  stop [services...]               stops services
  kill [services...]               kills services
  restart|rs [services...]         restarts services
  logs [options] <service>         logs a service
  ps [service...]                  list services
  size [service...]                sezes services data
  reset [service...]               sezes services config
  data [service...]                shows data directories
  help [command]                   display help for command

Examples:
  $ di start redis mongo
  $ di kill postgres
  $ di config
```

## License

Copyright 2022 Ivan Zakharchanka [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
