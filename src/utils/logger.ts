import * as winston from 'winston'
const format = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  ]
})

export default logger
