import React, { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import '@styles/panel.sass';

import SearchEntry from '@components/search-entry';
import SearchBar from '@components/searchbar';
import ISongData from '@models/songdata';
import ESBService from '@services/esb-service';
import FilterService from '@services/filter-service';

interface Props {}
interface State {
  loadingFromAPI: boolean;
  songs: ISongData[];
  filteredSongs: ISongData[];
}

export default class Panel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loadingFromAPI: true,
      songs: [],
      filteredSongs: [],
    };

    this.filterSongs = this.filterSongs.bind(this);
  }

  filterSongs(event: ChangeEvent<HTMLInputElement>): void {
    const filteredSongs = FilterService.filterSongs(this.state.songs, event.target.value);
    this.setState({
      filteredSongs,
    });
  }

  async loadSongs(): Promise<void> {
    const response = await ESBService.loadSongs();

    if (response.code === 200) {
      console.log(response);
      this.setState({ songs: response.data, filteredSongs: response.data });
    }
  }

  componentDidMount(): void {
    this.loadSongs();
  }

  public render(): JSX.Element {
    return (
      <div className={'panel flex flex-col h-full w-full space-y-2 p-2 overflow-hidden'}>
        <SearchBar onChange={debounce(this.filterSongs, 300)} />

        <div id={'songlist'} className={'overflow-auto'}>
          <div className={'pr-2 space-y-2 overflow-auto'}>
            {this.state.filteredSongs.map((song) => {
              return <SearchEntry songdata={song} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}
