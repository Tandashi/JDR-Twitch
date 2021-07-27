import ISongData from '@models/songdata';
import Fuse from 'fuse.js';

const fuseOptions = {
  limit: 1000,
  includeScore: true,
  findAllMatches: true,
  keys: ['title', 'artist'],
};

export default class FilterService {
  public static filterSongs(songs: ISongData[], filter: string): ISongData[] {
    if (filter === '') {
      return songs;
    }

    const fuse = new Fuse(songs, fuseOptions);
    return fuse.search(filter).map((v) => v.item);
  }
}
