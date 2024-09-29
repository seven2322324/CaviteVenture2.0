import { createLogger, format, transports } from 'winston';

// Create a logger instance
const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(), // Logs to the console
    new transports.File({ filename: 'error.log' }) // Logs to a file
  ]
});

export default logger;
