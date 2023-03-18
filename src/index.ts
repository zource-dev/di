import { Command } from 'commander';
import compose from './utils/compose';
import { dump } from './utils/dump';
import { listServices, loadConfig, saveConfig, resetServiceConfig, getPath, setPath, defaultConfig } from './config';
// @ts-ignore
import { version, description } from '../package.json';

const commands = new Command();

commands.name('di').description(description).version(version, '-v, --version');

commands
  .command('list')
  .alias('ls')
  .description('list all available services')
  .action(async () => {
    const services = await listServices();
    console.log('Available services:');
    for (const service of services) {
      console.log('\t', service);
    }
  });

commands
  .command('config')
  .description('print config')
  .action(async () => {
    const config = await loadConfig();
    dump(config);
  });

commands
  .command('config:reset')
  .description('reset config')
  .action(async () => {
    await saveConfig(defaultConfig);
  });

commands
  .command('config:edit')
  .description('edit config')
  .action(async () => {
    await saveConfig(defaultConfig);
  });

commands
  .command('config:get')
  .argument('path')
  .description('show config')
  .action(async (path) => {
    const config = await loadConfig();
    const configPath = getPath(config, path);
    dump(configPath);
  });

commands
  .command('config:set')
  .argument('path')
  .argument('value')
  .option('-i, --int', 'as integer')
  .option('-b, --bool', 'as boolean')
  .description('update config')
  .action(async (path, value, options) => {
    const config = await loadConfig();
    if (options.int) {
      setPath(config, path, parseInt(value));
    }
    if (options.bool) {
      setPath(config, path, !value.test(/^(false|0|\-)$/i));
    }

    await saveConfig(config);
    dump(config);
  });

commands
  .command('start')
  .argument('[services...]', 'services name to start')
  .option('-a, --attached', 'attach to service output')
  .description('starts services')
  .action(async (services, options) => {
    for (const service of services) {
      const { up } = await compose(service);
      await up(options.attached).catch((e) => console.error(e.stack));
    }
  });

commands
  .command('stop')
  .argument('[services...]', 'services name to stop')
  .description('stops services')
  .action(async (services) => {
    for (const service of services) {
      const { down } = await compose(service);
      await down().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('kill')
  .argument('[services...]', 'services name to kill')
  .description('kills services')
  .action(async (services) => {
    for (const service of services) {
      const { kill } = await compose(service);
      await kill().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('restart')
  .alias('rs')
  .argument('[services...]', 'services name to restart')
  .description('restarts services')
  .action(async (services) => {
    for (const service of services) {
      const { restart } = await compose(service);
      await restart().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('logs')
  .argument('<service>', 'a service name to log')
  .description('logs a service')
  .option('-f, --follow', 'Follow a service log output')
  .action(async (service, option) => {
    const { logs } = await compose(service);
    await logs(option.follow).catch((e) => console.error(e.stack));
  });

commands
  .command('ps')
  .argument('[service...]', 'services to list')
  .description('list services')
  .action(async (services) => {
    for (const service of services) {
      const { ps } = await compose(service);
      await ps().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('volumes')
  .argument('[service...]', 'services volumes list')
  .description('lists services volumes')
  .action(async (services) => {
    for (const service of services) {
      const { volumes } = await compose(service);
      await volumes().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('size')
  .argument('[service...]', 'services to retrieve data size')
  .description('sezes services data')
  .action(async (services) => {
    for (const service of services) {
      const { size } = await compose(service);
      await size().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('reset')
  .argument('[service...]', 'services to reset config')
  .description('resets services config')
  .action(async (services) => {
    for (const service of services) {
      await resetServiceConfig(service).catch((e) => console.error(e.stack));
    }
  });

commands
  .command('data')
  .argument('[service...]', 'services data directories')
  .description('shows data directories')
  .action(async (services) => {
    for (const service of services) {
      const { data } = await compose(service);
      await data().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('clean')
  .argument('[service...]', 'services to clean')
  .description('cleans services data')
  .action(async (services) => {
    for (const service of services) {
      const { down, clean } = await compose(service);
      await down();
      await clean().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('backup')
  .argument('[service...]', 'services to backup')
  .description('backups services data')
  .action(async (services) => {
    for (const service of services) {
      const { down, backup } = await compose(service);
      await down();
      await backup().catch((e) => console.error(e.stack));
    }
  });

commands
  .command('restore')
  .argument('[service...]', 'services to restore')
  .description('restores services data from backups')
  .action(async (services) => {
    for (const service of services) {
      const { down, restore } = await compose(service);
      await down();
      await restore().catch((e) => console.error(e.stack));
    }
  });

commands.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ di start redis mongo');
  console.log('  $ di kill postgres');
  console.log('  $ di config');
});

commands.parse(process.argv);
