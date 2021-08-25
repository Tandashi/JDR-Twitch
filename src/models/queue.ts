export default interface IQueue {
  enabled: boolean;
  entries: IQueueEntry[];
}

export interface IQueueEntry {
  title: string;
  fromChat: boolean;
  username: string;
}
