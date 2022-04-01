import * as Path from 'path';
import filesize from 'filesize';
import exec from './exec';
import { configDir, rootDir, getServiceConfig, fileDoesNotExist } from '../config';

export default async (service: string) => {
  const serviceDir = Path.join(rootDir, 'composers', service);
  const serviceFile = Path.join(serviceDir, 'docker-compose.yml');
  const serviceData = Path.join(configDir, service);
  const doesNotExist = await fileDoesNotExist(serviceFile);
  if (doesNotExist) {
    throw new Error(`Service "${service}" not found`);
  }
  const serviceConfig = await getServiceConfig(service);
  if (!serviceConfig) {
    throw new Error(`Service config "${service}" not found`);
  }

  return {
    up: async (attached?: boolean) => {
      const args = ['-f', serviceFile, 'up'];
      if (!attached) {
        args.push('-d');
      }
      await exec('docker-compose', args, serviceConfig);
    },
    down: async () => {
      await exec('docker-compose', ['-f', serviceFile, 'down'], serviceConfig);
    },
    kill: async () => {
      await exec('docker-compose', ['-f', serviceFile, 'kill'], serviceConfig);
    },
    restart: async () => {
      await exec('docker-compose', ['-f', serviceFile, 'restart'], serviceConfig);
    },
    logs: async (follow: boolean) => {
      const args = ['-f', serviceFile, 'logs'];
      if (follow) {
        args.push('-f');
      }
      await exec('docker-compose', args, serviceConfig);
    },
    ps: async () => {
      await exec('docker-compose', ['-f', serviceFile, 'ps'], serviceConfig);
    },
    size: async () => {
      const { stdout: servicesJson } = await exec('docker-compose', ['-f', serviceFile, 'ps', '--format', 'json'], serviceConfig, false);
      const serviceIds: string[] = JSON.parse(servicesJson).map((s: any) => s.ID);
      let totalSize = 0;
      for (const serviceId of serviceIds) {
        const { stdout: inspectJson } = await exec('docker', ['inspect', '--format', '{{json .Mounts}}', serviceId], serviceConfig, false);
        const data = JSON.parse(inspectJson);
        const volumes = await Promise.all(
          data
            .filter(({ Type }: any) => Type === 'bind')
            .map(({ Destination }: any) => exec('docker', ['exec', serviceId, 'sh', '-c', `du -s ${Destination} | awk '{print $1}'`], serviceConfig, false))
        );
        totalSize += volumes.reduce((result, { stdout }: any) => {
          return result + parseInt(stdout);
        }, 0);
      }

      const size = filesize(totalSize);
      console.log(service, size);
    },
    clean: async () => {
      console.log(service, serviceData);
    },
  };
};
