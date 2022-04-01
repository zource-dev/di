# Docker Infrastructure CLI

[![CI/CD](github-image)][github-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[npm-url]: https://www.npmjs.com/package/@zource/di
[downloads-image]: https://img.shields.io/npm/dw/@zource/di.svg?maxAge=43200
[npm-image]: https://img.shields.io/npm/v/@zource/di.svg?maxAge=43200
[github-url]: https://github.com/zource-dev/di/actions/workflows/build.yml
[github-image]: https://github.com/zource-dev/di/actions/workflows/build.yml/badge.svg
[codecov-url]: https://codecov.io/gh/zource-dev/di
[codecov-image]: https://codecov.io/gh/zource-dev/di/branch/master/graph/badge.svg?token=JZ8QCGH6PI
[codeclimate-url]: https://codeclimate.com/github/zource-dev/di/maintainability
[codeclimate-image]: https://api.codeclimate.com/v1/badges/0ba20f27f6db2b0fec8c/maintainability
[snyk-url]: https://snyk.io/test/npm/zource-dev/di/latest
[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/zource-dev/di.svg?maxAge=43200

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
  reset [service...]               resets services config
  data [service...]                shows data directories
  help [command]                   display help for command

Examples:
  $ di start redis mongo
  $ di kill postgres
  $ di config
```

## License

Copyright 2022 Ivan Zakharchanka [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
