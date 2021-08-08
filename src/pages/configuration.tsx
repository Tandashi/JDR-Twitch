import React, { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import ToggleButton from '@components/form/toggle';
import SearchBar from '@components/search/searchbar';
import ESBService from '@services/esb-service';
import ISongData from '@models/songdata';
import FilterService from '@services/filter-service';
import BanlistOverview from '@components/banlist/banlist-overview';

interface Props {}

interface State {
  songs: ISongData[];
  filteredSongs: ISongData[];

  configuration: {
    chatIntegration: {
      enabled: boolean;
    };
    requests: {
      perUser: number;
      duplicates: boolean;
    };
    unlimited: boolean;
    banlist: {
      [key: string]: ISongData;
    };
  };
}

export default class ConfigurationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      songs: [],
      filteredSongs: [],
      configuration: {
        chatIntegration: {
          enabled: false,
        },
        requests: {
          perUser: 1,
          duplicates: false,
        },
        unlimited: false,
        banlist: {},
      },
    };

    this.handleToggleChatIntegration = this.handleToggleChatIntegration.bind(this);
    this.handleToggleUnlimited = this.handleToggleUnlimited.bind(this);
    this.filterSongs = this.filterSongs.bind(this);
    this.handleBanToggle = this.handleBanToggle.bind(this);
    this.saveConfiguration = this.saveConfiguration.bind(this);
  }

  async componentDidMount(): Promise<void> {
    await this.loadSongs();
    await this.loadConfiguration();
  }

  async loadSongs(): Promise<void> {
    const responseResult = await ESBService.loadFilteredSongs(true);

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({ songs: responseResult.data.data, filteredSongs: responseResult.data.data });
      }
    }
  }

  async loadConfiguration(): Promise<void> {
    const responseResult = await ESBService.getConfiguration();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        const configuration = responseResult.data.data;

        const banlist: {
          [key: string]: ISongData;
        } = {};

        configuration.profile.active.banlist.forEach((e) => {
          banlist[e.id] = e;
        });

        this.setState({
          configuration: {
            chatIntegration: configuration.chatIntegration,
            requests: configuration.requests,
            unlimited: configuration.profile.active.configuration.song.unlimited,
            banlist: banlist,
          },
        });
      }
    }
  }

  handleToggleChatIntegration(): void {
    this.setState({
      configuration: {
        ...this.state.configuration,
        chatIntegration: {
          enabled: !this.state.configuration.chatIntegration.enabled,
        },
      },
    });
  }

  async handleToggleUnlimited(): Promise<void> {
    const profileResult = await ESBService.updateProfile(
      Object.keys(this.state.configuration.banlist),
      !this.state.configuration.unlimited
    );

    this.loadSongs();

    this.setState({
      configuration: {
        ...this.state.configuration,
        unlimited: !this.state.configuration.unlimited,
      },
    });
  }

  filterSongs(event: ChangeEvent<HTMLInputElement>): void {
    const filteredSongs = FilterService.filterSongs(this.state.songs, event.target.value);
    this.setState({
      filteredSongs,
    });
  }

  handleBanToggle(songdata: ISongData): void {
    const banlist = {
      ...this.state.configuration.banlist,
    };

    if (this.state.configuration.banlist[songdata.id]) {
      delete banlist[songdata.id];
    } else {
      banlist[songdata.id] = songdata;
    }

    this.setState({
      ...this.state,
      configuration: {
        ...this.state.configuration,
        banlist: banlist,
      },
    });
  }

  async saveConfiguration(): Promise<void> {
    const profileResult = await ESBService.updateProfile(
      Object.keys(this.state.configuration.banlist),
      this.state.configuration.unlimited
    );

    const configurationResult = await ESBService.updateConfiguration(
      this.state.configuration.chatIntegration.enabled,
      this.state.configuration.requests.perUser,
      this.state.configuration.requests.duplicates
    );
  }

  public render(): JSX.Element {
    return (
      <div className={'configuration flex flex-col space-y-2 rounded h-full w-full overflow-hidden p-2 select-none'}>
        <div className={'flex flex-row flex-30 space-y-4'}>
          <div className={'flex-1'}>
            <p className={'text-xl text-white font-bold'}>Chat Integration</p>
            <p className={'text-base text-white'}>
              If enable will add the
              <a className={'font-medium'} href={'https://www.twitch.tv/justdancerequests'}>
                JustDanceRequests
              </a>
              Bot to your channel. Commands: !sr, !banlist
            </p>
            <p className={'text-base text-white mt-2'}>
              <b>Note</b>: Banlist will not be enforced for songs requested via chat
            </p>

            <label htmlFor={'chat-integration-toggle'} className={'block text-white font-medium text-lg mt-4'}>
              Enabled
            </label>
            <ToggleButton
              id={'chat-integration-toggle'}
              checked={this.state.configuration.chatIntegration.enabled}
              onToggle={this.handleToggleChatIntegration}
            />
          </div>

          <div className={'flex-1'}>
            <p className={'text-xl text-white font-bold'}>Unlimited</p>
            <p className={'text-base text-white'}>If you have Just Dance unlimited</p>

            <label htmlFor={'unlimited-toggle'} className={'block text-white font-medium text-lg mt-4'}>
              Enabled
            </label>
            <ToggleButton
              id={'unlimited-toggle'}
              checked={this.state.configuration.unlimited}
              onToggle={this.handleToggleUnlimited}
            />
          </div>
        </div>

        <div className={'flex flex-col flex-70 space-y-4 overflow-auto'}>
          <SearchBar onChange={debounce(this.filterSongs, 300)} />

          <BanlistOverview
            songdata={this.state.filteredSongs}
            banlist={this.state.configuration.banlist}
            onBan={this.handleBanToggle}
          />
        </div>

        <button
          className={'mb-2 rounded-full py-1 px-24 bg-gradient-to-r from-green-400 to-blue-500 text-white'}
          onClick={this.saveConfiguration}
        >
          Save
        </button>
      </div>
    );
  }
}
