export default interface IQueue<T extends IQueueEntry | IQueueEntryExtended = IQueueEntry> {
  enabled: boolean;
  entries: T[];
}

export interface IQueueEntry {
  title: string;
  fromChat: boolean;
  username: string;

  /**
   * The state of the user that requested the entry.
   * Will give information about if the user is in chat and when he was last seen in chat.
   *
   * **Note**: Will be undefined for requests from mobile extension due to https://github.com/twitchdev/issues/issues/455.
   */
  userState: IQueueEntryUserState | undefined;
}

export interface IQueueEntryExtended extends IQueueEntry {
  index: number;
}

export interface IQueueEntryUserStateBase {
  /**
   * Wether the user is in the chat or not.
   */
  inChat: boolean;
  /**
   * The unix timestamp from when the user was last seen in chat.
   */
  lastSeen: number | undefined;
}

export interface IQueueEntryUserStateActive extends IQueueEntryUserStateBase {
  inChat: true;
  lastSeen: undefined;
}

export interface IQueueEntryUserStateInactive extends IQueueEntryUserStateBase {
  inChat: false;
  lastSeen: number;
}

export type IQueueEntryUserState = IQueueEntryUserStateActive | IQueueEntryUserStateInactive;
