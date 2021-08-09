import IQueue from './queue';
import IStreamerConfiguration from './streamer-configuration';

export default interface IStreamerData {
  channelId: string;
  secret: string;
  configuration: IStreamerConfiguration;
  queue: IQueue;
}
