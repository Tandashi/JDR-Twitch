import React, { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import '@styles/panel.sass';

import SearchBar from '@components/search/searchbar';
import ISongData from '@models/songdata';
import ESBService from '@services/esb-service';
import FilterService from '@services/filter-service';
import SongList from '@components/song/songlist';
import Overlay, { OverlayDirection } from '@components/overlay';
import RatingDisplay, { RatingDisplayPosition } from '@components/rating/rating-display';
import SongHeader from '@components/song/song-header';
import SongStats from '@components/song/song-stats';
import SongPreview from '@components/song/song-preview';
import SongDetails from '@components/song/song-details';

interface Props {}
interface State {
  loadingFromAPI: boolean;
  songs: ISongData[];
  filteredSongs: ISongData[];
  selectedSong?: ISongData;
  showDetails: boolean;
}

export default class Panel extends React.Component<Props, State> {
  private songlistRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      loadingFromAPI: true,
      songs: [],
      filteredSongs: [],
      selectedSong: undefined,
      showDetails: false,
    };

    this.songlistRef = React.createRef();

    this.filterSongs = this.filterSongs.bind(this);
    this.handleSongSelect = this.handleSongSelect.bind(this);
    this.handleDetailsBack = this.handleDetailsBack.bind(this);
  }

  filterSongs(event: ChangeEvent<HTMLInputElement>): void {
    const filteredSongs = FilterService.filterSongs(this.state.songs, event.target.value);
    this.songlistRef.current.scrollTo(0, 0);
    this.setState({
      filteredSongs,
    });
  }

  handleSongSelect(song: ISongData): void {
    this.setState({
      showDetails: true,
      selectedSong: song,
    });
  }

  handleDetailsBack(): void {
    this.setState({
      showDetails: false,
    });
  }

  async loadSongs(): Promise<void> {
    const response = await ESBService.loadSongs();

    if (response.code === 200) {
      this.setState({ songs: response.data, filteredSongs: response.data });
    }
  }

  componentDidMount(): void {
    this.loadSongs();
  }

  public render(): JSX.Element {
    return (
      <div className={'panel h-full w-full p-2 overflow-hidden'}>
        <div className={'h-full w-full flex flex-col space-y-2 overflow-hidden'}>
          <SearchBar onChange={debounce(this.filterSongs, 300)} />
          <SongList onSelect={this.handleSongSelect} songdata={this.state.filteredSongs} ref={this.songlistRef} />
        </div>
        <Overlay direction={OverlayDirection.RIGHT} isOpen={this.state.showDetails ? true : false}>
          {this.state.selectedSong ? (
            <SongDetails songdata={this.state.selectedSong} onBack={this.handleDetailsBack} />
          ) : undefined}
        </Overlay>
      </div>
    );
  }
}
