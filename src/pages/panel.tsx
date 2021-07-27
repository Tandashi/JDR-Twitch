import React from 'react';

import '@styles/panel.sass';

import SearchEntry from '@components/search-entry';
import SearchBar from '@components/searchbar';
import ISongData from '@models/songdata';
import ESBService from '@services/esb-service';

interface Props {}
interface State {
  loadingFromAPI: boolean;
  songs: ISongData[];
}

export default class Panel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loadingFromAPI: true,
      songs: [],
    };
  }

  async loadSongs(): Promise<void> {
    const response = await ESBService.loadSongs();

    if (response.code === 200) {
      console.log(response);
      this.setState({ songs: response.data });
    }
  }

  componentDidMount(): void {
    console.log('Can now query API');
    this.loadSongs();
  }

  public render(): JSX.Element {
    return (
      <div className={'panel flex flex-col h-full w-full space-y-2 p-2 overflow-hidden'}>
        <SearchBar onChange={(e) => console.log(e.target.value)} />

        <div id={'songlist'} className={'overflow-auto'}>
          <div className={'pr-2 space-y-2 overflow-auto'}>
            {this.state.songs.map((song) => {
              return <SearchEntry songdata={song} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}
