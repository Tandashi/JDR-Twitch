import ConfigService from './config-service';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export default class Logger {
  private static config = ConfigService.getConfig();

  public static log(level: LogLevel, data: any): void {
    if (this.config.logging.enabled) {
      let logFunc: (m: any) => void = undefined;

      switch (level) {
        case LogLevel.INFO:
          logFunc = console.info;
          break;
        case LogLevel.WARN:
          logFunc = console.warn;
          break;
        case LogLevel.ERROR:
          logFunc = console.error;
          break;
      }

      if (logFunc) logFunc({
        level: level,
        data: data
      });
    }
  }

  public static group(label: string, level?: LogLevel): void {
    console.groupCollapsed(`${level ? `[${level}]: ` : ''}${label}`);
  }

  public static groupEnd(): void {
    console.groupEnd();
  }

  public static info(data: any): void {
    this.log(LogLevel.INFO, data);
  }

  public static warn(data: any): void {
    this.log(LogLevel.WARN, data);
  }

  public static error(data: any): void {
    this.log(LogLevel.ERROR, data);
  }
}
