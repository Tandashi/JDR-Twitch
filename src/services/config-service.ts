interface TwitchConfig {
  auth?: Twitch.ext.Authorized;
}

interface EBSConfig {
  baseUrl: string;
}

interface Config {
  ebs: EBSConfig;
  twitch: TwitchConfig;
}

export default class ConfigService {
  private static instance?: ConfigService;

  private config: Config = {
    ebs: {
      // https://jd.tandashi.de
      // http://localhost:3000
      baseUrl: 'http://localhost:3000',
    },
    twitch: {
      auth: undefined,
    },
  };

  private static getInstance(): ConfigService {
    if (!this.instance) {
      this.instance = new ConfigService();
    }

    return this.instance;
  }

  public static setConfig(config: Config): void {
    const instance = this.getInstance();
    instance.config = config;
  }

  public static getConfig(): Config {
    const instance = this.getInstance();
    return instance.config;
  }
}
