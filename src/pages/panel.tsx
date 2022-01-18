import React, { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import '@styles/panel.sass';

import IQueue, { IQueueEntryExtended } from '@models/queue';

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
import IUserData from '@models/userdata';

interface Props {}
interface State {
  loadingFromAPI: boolean;
  showDetails: boolean;
  tabIndex: number;
  userData: IUserData;
  song: {
    songs: ISongData[];
    filteredSongs: ISongData[];
    selected?: ISongData;
    filter: string;
  };
  queue: {
    queue: IQueue<IQueueEntryExtended>;
    filteredQueue: IQueue<IQueueEntryExtended>;
    filter: string;
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
      userData: {
        favouriteSongs: [],
      },
      song: {
        songs: [],
        filteredSongs: [],
        selected: undefined,
        filter: '',
      },
      queue: {
        queue: { enabled: false, entries: [] },
        filteredQueue: { enabled: false, entries: [] },
        filter: '',
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
    this.loadUserData();
    this.registerSocketHandler();
  }

  async registerSocketHandler(): Promise<void> {
    ESBSocketIOService.registerHandler('v1/queue:updated', (queue: IQueue) => {
      const extendedQueue = this.extendQueue(queue);

      this.setState({
        queue: {
          ...this.state.queue,
          queue: extendedQueue,
          filteredQueue: {
            ...extendedQueue,
            entries: FilterService.filterQueue(extendedQueue.entries, this.state.queue.filter),
          },
        },
      });
    });

    // Update userData when it should have changed
    ESBSocketIOService.registerHandler('v1/userdata:updated', (userData: IUserData) => {
      this.setState({
        userData,
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
    const filterValue = event.target.value;
    const filteredSongs = FilterService.filterSongs(this.state.song.songs, filterValue);
    this.songlistRef.current.scrollTo(0, 0);
    this.setState({
      song: {
        ...this.state.song,
        filter: filterValue,
        filteredSongs: filteredSongs,
      },
    });
  }

  async loadQueue(): Promise<void> {
    const responseResult = await ESBService.getQueue();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        const extendedQueue = this.extendQueue(responseResult.data.data);

        this.setState({
          queue: {
            ...this.state.queue,
            queue: extendedQueue,
            filteredQueue: extendedQueue,
          },
        });
      }
    }
  }

  filterQueue(event: ChangeEvent<HTMLInputElement>): void {
    const filterValue = event.target.value;
    const filteredQueueEntries = FilterService.filterQueue(this.state.queue.queue.entries, filterValue);
    this.queuelistRef.current.scrollTo(0, 0);
    this.setState({
      queue: {
        ...this.state.queue,
        filter: filterValue,
        filteredQueue: {
          ...this.state.queue.filteredQueue,
          entries: filteredQueueEntries,
        },
      },
    });
  }

  extendQueue(queue: IQueue): IQueue<IQueueEntryExtended> {
    return {
      ...queue,
      entries: queue.entries.map((e, i) => {
        return {
          ...e,
          index: i + 1,
        };
      }),
    };
  }

  async loadUserData(): Promise<void> {
    const responseResult = await ESBService.getUserData();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({
          userData: responseResult.data.data,
        });
      }
    }
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
        <TabBar
          onSelect={this.handleTabSelect}
          selectedIndex={this.state.tabIndex}
          tabNames={['Search', 'Queue', 'Favourites']}
        >
          <TabBarContent>
            <div className={'flex flex-1 flex-col space-y-2 p-2 overflow-hidden'}>
              <div className={'flex flex-row'}>
                <SearchBar value={this.state.song.filter} onChange={debounce(this.filterSongs, 300)} />
              </div>
              <SongList
                onSelect={this.handleSongSelect}
                songdata={this.state.song.filteredSongs}
                ref={this.songlistRef}
              />
            </div>

            <div className={'flex flex-1 flex-col space-y-2 p-2 overflow-hidden'}>
              <div className='flex flex-row space-x-2'>
                <div className='flex-80'>
                  <SearchBar value={this.state.queue.filter} onChange={debounce(this.filterQueue, 300)} />
                </div>
                <div
                  className={`flex flex-20 bg-opacity-40 ${
                    this.state.queue.filteredQueue.enabled ? 'bg-green-500' : 'bg-pink-600'
                  } rounded p-2 items-center justify-center`}
                >
                  {this.state.queue.filteredQueue.enabled ? (
                    <p className='text-xs md:text-sm lg:text-base text-center text-white'>Open</p>
                  ) : (
                    <p className='text-xs md:text-sm lg:text-base text-center text-white'>Closed</p>
                  )}
                </div>
              </div>
              <QueueList queue={this.state.queue.filteredQueue} ref={this.queuelistRef} />
            </div>

            <div className={'flex flex-1 flex-col space-y-2 p-2 overflow-hidden'}>
              <SongList
                onSelect={this.handleSongSelect}
                songdata={this.state.userData.favouriteSongs}
                ref={this.songlistRef}
              />
            </div>
          </TabBarContent>
        </TabBar>

        <Overlay direction={OverlayDirection.RIGHT} isOpen={this.state.showDetails ? true : false}>
          {this.state.song.selected ? (
            <SongDetails
              userData={this.state.userData}
              songdata={this.state.song.selected}
              onBack={this.handleDetailsBack}
              onUserDataUpdated={(userData) => {
                this.setState({
                  userData,
                });
              }}
            />
          ) : undefined}
        </Overlay>
      </div>
    );
  }
}
