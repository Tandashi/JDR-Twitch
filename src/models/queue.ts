export default interface IQueue {
  enabled: boolean;
  entries: {
    title: string;
    fromChat: boolean;
  }[];
}
