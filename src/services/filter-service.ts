import Fuse from 'fuse.js';

import { IQueueEntry, IQueueEntryExtended } from '@models/queue';
import ISongData from '@models/songdata';
import Logger from './logging';

const baseFuseOptions = {
  limit: 1000,
  includeScore: true,
  findAllMatches: true,
  distance: 10,
  threshold: 0.4,
};

const songFuseOptions = {
  ...baseFuseOptions,
  keys: ['title', 'artist'],
};

const queueFuseOptions = {
  ...baseFuseOptions,
  keys: ['title'],
};

export default class FilterService {
  private static filter<T>(fuseOptions: Fuse.IFuseOptions<T>, data: T[], filter: string): T[] {
    Logger.group('Filter data');
    Logger.info({ data, filter, fuseOptions });
    Logger.groupEnd();

    if (filter === '') {
      return data;
    }

    const fuse = new Fuse(data, fuseOptions);
    return fuse.search(filter).map((v) => v.item);
  }

  public static filterSongs(songs: ISongData[], filter: string): ISongData[] {
    return this.filter(songFuseOptions, songs, filter);
  }

  public static filterQueue<T extends IQueueEntry | IQueueEntryExtended>(entries: T[], filter: string): T[] {
    return this.filter(queueFuseOptions, entries, filter);
  }
}
