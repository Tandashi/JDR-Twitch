interface TwitchConfig {
  auth?: Twitch.ext.Authorized;
}

interface EBSConfig {
  baseUrl: string;
  api: ESBAPIConfig;
}

interface ESBAPIConfig {
  secret: string;
}

interface Config {
  ebs: EBSConfig;
  twitch: TwitchConfig;
}

export default class ConfigService {
  private static instance?: ConfigService;

  private config: Config = {
    ebs: {
      // Will be replaced in the Rollup
      baseUrl: 'EBS_SERVER_URL',
      api: {
        secret: undefined,
      },
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
