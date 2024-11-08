import winston from 'winston';
import util from 'util';
import colors from 'colors/safe';

// Custom format
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  let colorizedLevel;
  switch (level) {
    case 'info':
      colorizedLevel = colors.green(`[${level.toUpperCase()}]`);
      break;
    case 'warn':
      colorizedLevel = colors.yellow(`[${level.toUpperCase()}]`);
      break;
    case 'error':
      colorizedLevel = colors.red(`[${level.toUpperCase()}]`);
      break;
    case 'debug':
      colorizedLevel = colors.blue(`[${level.toUpperCase()}]`);
      break;
    default:
      colorizedLevel = `[${level.toUpperCase()}]`;
  }

  const formattedMessage =
    typeof message === 'object' ? util.inspect(message, { colors: true, depth: null }) : message;

  return `${colorizedLevel} ${timestamp} ${formattedMessage}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD-HH-mm-ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console()
  ],
});

// Enable or disable colors based on environment
if (process.env.NODE_ENV === 'production') {
  colors.disable();
} else {
  colors.enable();
}

export default logger;