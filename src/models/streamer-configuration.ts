import IProfile from '@models/profile';

export default interface IStreamerConfiguration {
  version: string;

  chatIntegration: {
    enabled: boolean;
    channelName: string;
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
