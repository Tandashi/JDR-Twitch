import Fuse from 'fuse.js';

import { IQueueEntry } from '@models/queue';
import ISongData from '@models/songdata';

const baseFuseOptions = {
  limit: 1000,
  includeScore: true,
  findAllMatches: true,
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
    if (filter === '') {
      return data;
    }

    const fuse = new Fuse(data, fuseOptions);
    return fuse.search(filter).map((v) => v.item);
  }

  public static filterSongs(songs: ISongData[], filter: string): ISongData[] {
    return this.filter(songFuseOptions, songs, filter);
  }

  public static filterQueue(entries: IQueueEntry[], filter: string): IQueueEntry[] {
    return this.filter(queueFuseOptions, entries, filter);
  }
}
