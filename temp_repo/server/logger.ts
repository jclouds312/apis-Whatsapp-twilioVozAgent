
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  private log(level: LogLevel, message: string, source: string = 'system', data?: any) {
    const timestamp = this.formatTimestamp();
    const logMessage = `${timestamp} [${source}] [${level}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  debug(message: string, source?: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, source, data);
    }
  }

  info(message: string, source?: string, data?: any) {
    this.log(LogLevel.INFO, message, source, data);
  }

  warn(message: string, source?: string, data?: any) {
    this.log(LogLevel.WARN, message, source, data);
  }

  error(message: string, source?: string, data?: any) {
    this.log(LogLevel.ERROR, message, source, data);
  }
}

export const logger = new Logger();
