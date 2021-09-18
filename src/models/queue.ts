export default interface IQueue<T extends IQueueEntry | IQueueEntryExtended = IQueueEntry> {
  enabled: boolean;
  entries: T[];
}

export interface IQueueEntry {
  title: string;
  fromChat: boolean;
  username: string;
}

export interface IQueueEntryExtended extends IQueueEntry {
  index: number;
}
