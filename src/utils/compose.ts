import * as Path from 'path';
import { filesize } from 'filesize';
import exec from './exec';
import { configDir, rootDir, getServiceConfig, fileDoesNotExist } from '../config';

export default async (service: string) => {
  const serviceDir = Path.join(rootDir, 'composers', service);
  const serviceFile = Path.join(serviceDir, 'docker-compose.yml');
  const serviceData = Path.join(configDir, service);
  const dataVolume = `${service}_data`;
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
      const args = ['compose', '-f', serviceFile, 'up'];
      if (!attached) {
        args.push('-d');
      }
      await exec('docker', args, serviceConfig);
    },
    down: async () => {
      await exec('docker', ['compose', '-f', serviceFile, 'down'], serviceConfig);
    },
    kill: async () => {
      await exec('docker', ['compose', '-f', serviceFile, 'kill'], serviceConfig);
    },
    restart: async () => {
      await exec('docker', ['compose', '-f', serviceFile, 'restart'], serviceConfig);
    },
    logs: async (follow: boolean) => {
      const args = ['compose', '-f', serviceFile, 'logs'];
      if (follow) {
        args.push('-f');
      }
      await exec('docker', args, serviceConfig);
    },
    ps: async () => {
      await exec('docker', ['compose', '-f', serviceFile, 'ps'], serviceConfig);
    },
    volumes: async () => {
      const { stdout: servicesJson } = await exec('docker', ['compose', '-f', serviceFile, 'ps', '--format', 'json'], serviceConfig, false);
      const serviceIds: string[] = JSON.parse(servicesJson).map((s: any) => s.ID);
      for (const serviceId of serviceIds) {
        const { stdout: inspectJson } = await exec('docker', ['inspect', '--format', '{{json .Mounts}}', serviceId], serviceConfig, false);
        const mounts = JSON.parse(inspectJson) as any[];
        for (const { Source, Destination } of mounts) {
          console.log(service, Source, Destination);
        }
      }
    },
    size: async () => {
      const { stdout: servicesJson } = await exec('docker', ['compose', '-f', serviceFile, 'ps', '--format', 'json'], serviceConfig, false);
      const serviceIds: string[] = JSON.parse(servicesJson).map((s: any) => s.ID);
      let totalSize = 0;
      for (const serviceId of serviceIds) {
        const { stdout: inspectJson } = await exec('docker', ['inspect', '--format', '{{json .Mounts}}', serviceId], serviceConfig, false);
        const data = JSON.parse(inspectJson);
        const volumes = await Promise.all(data.map(({ Destination }: any) => exec('docker', ['exec', serviceId, 'sh', '-c', `du -s ${Destination} | awk '{print $1}'`], serviceConfig, false)));
        totalSize += volumes.reduce((result, { stdout }: any) => {
          return result + parseInt(stdout) * 1024;
        }, 0);
      }

      const size = filesize(totalSize);
      console.log(service, size);
    },
    data: async () => {
      console.log(service, serviceData);
    },
    clean: async () => {
      await exec('docker', ['volume', 'rm', dataVolume], serviceConfig);
    },
    backup: async () => {
      await exec(
        'docker',
        ['run', '--rm', '-v', `${serviceData}:/backup/to`, '-v', `${dataVolume}:/backup/from`, '-w=/backup/from', 'alpine', 'sh', '-c', 'tar cvf /backup/to/backup.tar .'],
        serviceConfig
      );
    },
    restore: async () => {
      await exec(
        'docker',
        ['run', '--rm', '-v', `${serviceData}:/restore/from`, '-v', `${dataVolume}:/restore/to`, '-w=/restore/to', 'alpine', 'sh', '-c', 'tar xvf /restore/from/backup.tar -C /restore/to'],
        serviceConfig
      );
    },
  };
};
