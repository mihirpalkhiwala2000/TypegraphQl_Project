import * as winston from "winston";

const isProduction = (): boolean => process.env.Node_env === "production";

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, metadata }) => {
          if (metadata) {
            return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
              metadata
            )}`;
          }

          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),
  ],
  levels: isProduction()
    ? { error: 1, warn: 1, info: 1 }
    : { error: 1, warn: 1, info: 1, debug: 1 },
});

export { logger };
