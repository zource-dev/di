import { spawn } from 'child_process';

export default (command: string, args: string[] = [], env = {}, expose = true) => {
  const execution = spawn(command, args, {
    stdio: 'pipe',
    env: {
      ...process.env,
      ...env,
    },
  });

  const output: Buffer[] = [];
  execution.stdout.on('data', (data) => {
    output.push(data);
    if (expose) {
      process.stdout.write(data);
    }
  });

  const error: Buffer[] = [];
  execution.stderr.on('data', (data) => {
    error.push(data);
    if (expose) {
      process.stderr.write(data);
    }
  });

  return new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    execution.on('close', (code) => {
      resolve({ code, stdout: Buffer.concat(output).toString('utf-8'), stderr: Buffer.concat(error).toString('utf-8') });
    });
  });
};
