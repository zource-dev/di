import * as Path from 'path';
import { promises as Fs, constants } from 'fs';
import { homedir } from 'os';

export const configDir = Path.join(homedir(), '.di');
export const configFilename = Path.join(configDir, 'config.json');
export const rootDir = Path.resolve(__dirname, '..');

export type Config = Record<string, Record<string, any>>;

export const defaultConfig: Config = {
  redis: {
    port: 6379,
    uiport: 8085,
    host: 'redis',
    version: 'latest',
  },
  rabbitmq: {
    port: 5672,
    mport: 15672,
    host: 'rabbitmq',
    version: 'management-alpine',
  },
  mongo: {
    port: 27017,
    host: 'mongo',
    version: 'latest',
  },
  postgres: {
    port: 5432,
    host: 'postgres',
    version: 'latest',
  },
  kafka: {
    port: 9092,
    uiport: 9091,
    host: 'kafka',
    version: 'latest',
  },
  neo4j: {
    port: 7474,
    host: 'neo4j',
    version: 'latest',
  },
  dynamodb: {
    port: 8000,
    host: 'dynamodb',
    version: 'latest',
  },
  nginx: {
    port: 8080,
    host: 'nginx',
    version: 'alpine',
    config: Path.join(rootDir, 'composers/nginx/nginx.conf'),
  },
};

export const listServices = () => Fs.readdir(Path.join(rootDir, 'composers'));

export const fileDoesNotExist = (filename: string) => Fs.access(filename, constants.F_OK).catch(Boolean);

export const loadConfig = async () => {
  const doesNotExist = await fileDoesNotExist(configFilename);
  if (doesNotExist) {
    return saveConfig(defaultConfig);
  }
  return JSON.parse(await Fs.readFile(configFilename, 'utf-8')) as Config;
};

export const saveConfig = async (config: Config) => {
  await Fs.mkdir(configDir, { recursive: true });
  await Fs.writeFile(configFilename, JSON.stringify(config, null, '  '));

  return config;
};

export const getServiceConfig = async (service: string) => {
  const config = await loadConfig();
  const serviceConfig = config[service] ?? (await setServiceConfig(service, defaultConfig[service]));

  return {
    home: Path.join(configDir, service),
    ...serviceConfig,
  };
};

export const setServiceConfig = async (service: string, serviceConfig: Record<string, any>) => {
  const config = await loadConfig();
  config[service] = serviceConfig;
  await saveConfig(config);

  return {
    home: Path.join(configDir, service),
    ...serviceConfig,
  };
};

export const resetServiceConfig = async (service: string) => {
  const serviceConfig = await setServiceConfig(service, defaultConfig[service]);

  return {
    home: Path.join(configDir, service),
    ...serviceConfig,
  };
};

export const getPath = (target: any, path: string): any => {
  const [key, ...paths] = path.split('.');
  if (paths.length > 0) {
    if (typeof target[key] !== 'undefined') {
      const newTarget = target[key];
      return getPath(newTarget, paths.join('.'));
    }
  }
  return target[key];
};

export const setPath = (target: any, path: string, value: any) => {
  const [key, ...paths] = path.split('.');
  if (paths.length > 0) {
    target[key] = target?.[key] ?? {};
    const newTarget = target[key];
    setPath(newTarget, paths.join('.'), value);
  } else if (typeof target === 'object') {
    target[key] = value;
  }
};
