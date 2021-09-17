import React, { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import '@styles/panel.sass';

import IQueue from '@models/queue';

import ESBSocketIOService from '@services/esb-socketio-service';

import SearchBar from '@components/search/searchbar';
import TabBar from '@components/form/tab-bar';
import ISongData from '@models/songdata';
import ESBService from '@services/esb-api-service';
import FilterService from '@services/filter-service';
import SongList from '@components/song/songlist';
import Overlay, { OverlayDirection } from '@components/overlay';
import SongDetails from '@components/song/song-details';
import TabBarContent from '@components/form/tab-bar-content';
import QueueList from '@components/queue/queue-list';

interface Props {}
interface State {
  loadingFromAPI: boolean;
  showDetails: boolean;
  tabIndex: number;
  song: {
    songs: ISongData[];
    filteredSongs: ISongData[];
    selected?: ISongData;
  };
  queue: {
    queue: IQueue;
    filteredQueue: IQueue;
  };
}

export default class PanelPage extends React.Component<Props, State> {
  private songlistRef: React.RefObject<HTMLDivElement>;
  private queuelistRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      loadingFromAPI: true,
      showDetails: false,
      tabIndex: 0,
      song: {
        songs: [],
        filteredSongs: [],
        selected: undefined,
      },
      queue: {
        queue: { enabled: false, entries: [] },
        filteredQueue: { enabled: false, entries: [] },
      },
    };

    this.songlistRef = React.createRef();
    this.queuelistRef = React.createRef();

    this.filterSongs = this.filterSongs.bind(this);
    this.filterQueue = this.filterQueue.bind(this);
    this.handleSongSelect = this.handleSongSelect.bind(this);
    this.handleDetailsBack = this.handleDetailsBack.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  componentDidMount(): void {
    this.loadSongs();
    this.loadQueue();
    this.registerSocketHandler();
  }

  async registerSocketHandler(): Promise<void> {
    ESBSocketIOService.registerHandler('v1/queue:updated', (queue: IQueue) => {
      this.setState({
        queue: {
          ...this.state.queue,
          queue: queue,
        },
      });
    });
  }

  async loadSongs(): Promise<void> {
    const responseResult = await ESBService.loadFilteredSongs(false);

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({
          song: {
            ...this.state.song,
            songs: responseResult.data.data,
            filteredSongs: responseResult.data.data,
          },
        });
      }
    }
  }

  filterSongs(event: ChangeEvent<HTMLInputElement>): void {
    const filteredSongs = FilterService.filterSongs(this.state.song.songs, event.target.value);
    this.songlistRef.current.scrollTo(0, 0);
    this.setState({
      song: {
        ...this.state.song,
        filteredSongs: filteredSongs,
      },
    });
  }

  async loadQueue(): Promise<void> {
    const responseResult = await ESBService.getQueue();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({
          queue: {
            queue: responseResult.data.data,
            filteredQueue: responseResult.data.data,
          },
        });
      }
    }
  }

  filterQueue(event: ChangeEvent<HTMLInputElement>): void {
    const filteredQueueEntries = FilterService.filterQueue(this.state.queue.queue.entries, event.target.value);
    this.queuelistRef.current.scrollTo(0, 0);
    this.setState({
      queue: {
        ...this.state.queue,
        filteredQueue: {
          ...this.state.queue.filteredQueue,
          entries: filteredQueueEntries,
        },
      },
    });
  }

  handleSongSelect(song: ISongData): void {
    this.setState({
      showDetails: true,
      song: {
        ...this.state.song,
        selected: song,
      },
    });
  }

  handleDetailsBack(): void {
    this.setState({
      showDetails: false,
    });
  }

  handleTabSelect(index: number): void {
    this.setState({
      tabIndex: index,
    });
  }

  public render(): JSX.Element {
    return (
      <div className={'panel h-full w-full overflow-hidden select-none'}>
        <TabBar onSelect={this.handleTabSelect} selectedIndex={this.state.tabIndex} tabNames={['Search', 'Queue']}>
          <TabBarContent>
            <div className={'flex flex-col p-2 space-y-2 overflow-hidden'}>
              <SearchBar onChange={debounce(this.filterSongs, 300)} />
              <SongList
                onSelect={this.handleSongSelect}
                songdata={this.state.song.filteredSongs}
                ref={this.songlistRef}
              />
            </div>

            <div className={'flex flex-1 flex-col space-y-2 p-2 overflow-hidden'}>
              <SearchBar onChange={debounce(this.filterQueue, 300)} />
              <QueueList queue={this.state.queue.filteredQueue} ref={this.queuelistRef} />
            </div>
          </TabBarContent>
        </TabBar>

        <Overlay direction={OverlayDirection.RIGHT} isOpen={this.state.showDetails ? true : false}>
          {this.state.song.selected ? (
            <SongDetails songdata={this.state.song.selected} onBack={this.handleDetailsBack} />
          ) : undefined}
        </Overlay>
      </div>
    );
  }
}
