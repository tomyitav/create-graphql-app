import * as spawn_ from 'cross-spawn';
const spawn = spawn_;

export function shell(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const commandParts = command.split(' ')
    const cmd = spawn(commandParts[0], commandParts.slice(1), {
      cwd: process.cwd(),
      detached: false,
      stdio: 'inherit',
    })

    cmd.on('error', reject)
    cmd.on('close', resolve)
  })
}
