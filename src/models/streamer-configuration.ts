import IProfile from '@models/profile';
import ISongData from '@models/songdata';

export default interface IStreamerConfiguration {
  version: string;

  chatIntegration: {
    enabled: boolean;
    channelName: string;
    banlistFormat: string;
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
  banlistFormat: string;
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
