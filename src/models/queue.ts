export default interface IQueue {
  channelId: number;
  entries: {
    title: string;
    fromChat: boolean;
  }[];
}
