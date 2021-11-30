import IProfile from '@models/profile';
import ISongData from '@models/songdata';

export default interface IStreamerConfiguration {
  version: string;

  chatIntegration: {
    enabled: boolean;
    channelName: string;
    announcements: {
      queue: {
        status: {
          opened: boolean;
          closed: boolean;
          cleared: boolean;
        };
        song: {
          fromChat: boolean;
          fromExtension: boolean;
          nextUp: boolean;
        };
      };
    };
    commands: {
      songRequest: {
        enabled: boolean;
      };
      queue: {
        enabled: boolean;
      };
      queuePosition: {
        enabled: boolean;
      };
      banlist: {
        enabled: boolean;
        format: string;
      };
    };
  };

  requests: {
    perUser: number;
    duplicates: boolean;
  };

  profile: {
    active: IProfile;
    profiles: IProfile[];
  };
}

export interface IUpdateChatIntegrationConfiguration {
  enabled: boolean;
  announcements: {
    queue: {
      status: {
        opened: boolean;
        closed: boolean;
        cleared: boolean;
      };
      song: {
        fromChat: boolean;
        fromExtension: boolean;
        nextUp: boolean;
      };
    };
  };
  commands: {
    songRequest: {
      enabled: boolean;
    };
    queue: {
      enabled: boolean;
    };
    queuePosition: {
      enabled: boolean;
    };
    banlist: {
      enabled: boolean;
      format: string;
    };
  };
}

export interface IUpdateRequestsConfiguration {
  perUser: number;
  duplicates: boolean;
}

export interface IUpdateStreamerConfiguration {
  chatIntegration: IUpdateChatIntegrationConfiguration;
  requests: IUpdateRequestsConfiguration;
}

export interface IUpdateProfile {
  game: string;
  unlimited: boolean;
  banlist: { [key: string]: ISongData };
}
