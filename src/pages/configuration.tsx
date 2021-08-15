import React, { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ToggleButton from '@components/form/toggle';
import SearchBar from '@components/search/searchbar';
import ESBService from '@services/esb-service';
import ISongData from '@models/songdata';
import FilterService from '@services/filter-service';
import BanlistOverview from '@components/banlist/banlist-overview';
import Select from '@components/form/select';
import IStreamerData from '@models/streamerdata';
import StatusMessage, { StatusMessageDisplayType } from '@components/status-message';
import { Result } from '@models/result';

interface Props {}

interface State {
  songs: ISongData[];
  filteredSongs: ISongData[];

  games: string[];

  streamerData?: IStreamerData;

  statusMessage: {
    timeout?: NodeJS.Timeout;
    displayType: StatusMessageDisplayType;
  };

  configuration: {
    chatIntegration: {
      enabled: boolean;
    };
    requests: {
      perUser: number;
      duplicates: boolean;
    };
    selectedGame: string;
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
      games: [],
      streamerData: undefined,

      statusMessage: {
        displayType: {
          type: 'none',
        },
      },
      configuration: {
        chatIntegration: {
          enabled: false,
        },
        requests: {
          perUser: 1,
          duplicates: false,
        },
        selectedGame: '',
        unlimited: false,
        banlist: {},
      },
    };

    this.handleToggleChatIntegration = this.handleToggleChatIntegration.bind(this);
    this.handleToggleUnlimited = this.handleToggleUnlimited.bind(this);
    this.filterSongs = this.filterSongs.bind(this);
    this.handleBanToggle = this.handleBanToggle.bind(this);
    this.saveConfiguration = this.saveConfiguration.bind(this);
    this.handleGameSelect = this.handleGameSelect.bind(this);
    this.handleOnCopy = this.handleOnCopy.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
  }

  async componentDidMount(): Promise<void> {
    await this.loadSongs();
    await this.loadConfiguration();
    await this.loadGames();
  }

  componentWillUnmount(): void {
    clearTimeout(this.state.statusMessage.timeout);
  }

  async loadGames(): Promise<void> {
    const responseResult = await ESBService.getGames();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({ games: responseResult.data.data });
      }
    }
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
    const responseResult = await ESBService.getStreamerData();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        const streamerData = responseResult.data.data;

        const banlist: {
          [key: string]: ISongData;
        } = {};

        streamerData.configuration.profile.active.banlist.forEach((e) => {
          banlist[e.id] = e;
        });

        this.setState({
          streamerData: streamerData,
          configuration: {
            chatIntegration: streamerData.configuration.chatIntegration,
            requests: streamerData.configuration.requests,
            selectedGame: streamerData.configuration.profile.active.configuration.song.game,
            unlimited: streamerData.configuration.profile.active.configuration.song.unlimited,
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
    this.processResults(
      [
        await ESBService.updateProfile(
          Object.keys(this.state.configuration.banlist),
          this.state.configuration.selectedGame,
          !this.state.configuration.unlimited
        ),
      ],
      false
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

  async handleGameSelect(event: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
    this.processResults(
      [
        await ESBService.updateProfile(
          Object.keys(this.state.configuration.banlist),
          event.target.value,
          this.state.configuration.unlimited
        ),
      ],
      false
    );

    this.loadSongs();

    this.setState({
      configuration: {
        ...this.state.configuration,
        selectedGame: event.target.value,
      },
    });
  }

  async saveConfiguration(): Promise<void> {
    this.processResults(
      [
        await ESBService.updateProfile(
          Object.keys(this.state.configuration.banlist),
          this.state.configuration.selectedGame,
          this.state.configuration.unlimited
        ),
        await ESBService.updateConfiguration(
          this.state.configuration.chatIntegration.enabled,
          this.state.configuration.requests.perUser,
          this.state.configuration.requests.duplicates
        ),
      ],
      true
    );
  }

  private clearMessage(): void {
    this.setState({
      statusMessage: {
        timeout: undefined,
        displayType: {
          type: 'none',
        },
      },
    });
  }

  private processResults(
    results: Result<any, any>[],
    showSuccess: boolean,
    messages?: { successMessage?: string; errorMessage?: string }
  ): void {
    results.forEach((result) => {
      if (result.type === 'error') {
        return this.setState({
          statusMessage: {
            timeout: setTimeout(this.clearMessage, 2000),
            displayType: {
              type: 'error',
              message: messages?.errorMessage ?? result.message,
            },
          },
        });
      }
    });

    if (!showSuccess) {
      return;
    }

    return this.setState({
      statusMessage: {
        timeout: setTimeout(this.clearMessage, 2000),
        displayType: {
          type: 'success',
          message: messages?.successMessage ?? 'Success',
        },
      },
    });
  }

  private getEmbedUrl(): string {
    return `${window.location.origin}/live-config.html?secret=${this.state.streamerData?.secret}`;
  }

  private handleOnCopy(): void {
    this.setState({
      statusMessage: {
        timeout: setTimeout(this.clearMessage, 1000),
        displayType: {
          type: 'success',
          message: 'Copied',
        },
      },
    });
  }

  public render(): JSX.Element {
    return (
      <div className={'configuration flex flex-col space-y-2 rounded h-full w-full overflow-hidden select-none'}>
        <div className={'flex flex-col space-y-2 p-2 rounded h-full w-full overflow-hidden select-none'}>
          <div className={'flex flex-col'}>
            <div className={'flex flex-row flex-30 p-4'}>
              <div className={'flex-1 pr-2'}>
                <p className={'text-xl text-white font-bold'}>Chat Integration</p>
                <p className={'text-base text-white'}>
                  If enable will add the
                  <a className={'font-medium'} href={'https://www.twitch.tv/justdancerequests'}>
                    &nbsp;JustDanceRequests&nbsp;
                  </a>
                  Bot to your channel. <br />
                  Commands: !sr, !banlist
                </p>
                <p className={'text-base text-white my-2'}>
                  <b>Note</b>: Banlist will not be enforced for songs requested via chat
                </p>

                <ToggleButton
                  id={'chat-integration-toggle'}
                  checked={this.state.configuration.chatIntegration.enabled}
                  onToggle={this.handleToggleChatIntegration}
                />
              </div>

              <div className={'flex-1 px-2'}>
                <p className={'text-xl text-white font-bold'}>Unlimited</p>
                <p className={'text-base text-white'}>If you have Just Dance unlimited</p>

                <p className={'text-base text-white my-2'}>
                  <b>Note</b>: Changing this value will automatically save.
                </p>

                <ToggleButton
                  id={'unlimited-toggle'}
                  checked={this.state.configuration.unlimited}
                  onToggle={this.handleToggleUnlimited}
                />
              </div>

              <div className={'flex-1 pl-2'}>
                <p className={'text-xl text-white font-bold'}>Game</p>
                <p className={'text-base text-white'}>The Just Dance version you use</p>

                <p className={'text-base text-white mt-2'}>
                  <b>Note</b>: Changing the game will automatically save.
                </p>

                <div className={'my-2'}>
                  <Select
                    onChange={this.handleGameSelect}
                    selected={this.state.configuration.selectedGame}
                    options={this.state.games}
                  />
                </div>
              </div>
            </div>
            <div className={'flex flex-row p-4'}>
              <div className={'flex-1'}>
                <p className={'text-xl text-white font-bold'}>Queue Streamlabs Integration</p>
                <p className={'text-base text-white'}>
                  Copy the embed link and add it as Browser Component in Streamlabs
                </p>

                <CopyToClipboard text={this.getEmbedUrl()} onCopy={this.handleOnCopy}>
                  <div className={'flex items-center justify-center mt-2 p-2 w-10 h-10 rounded ripple-bg-purple-600'}>
                    <svg
                      xmlns={'http://www.w3.org/2000/svg'}
                      className={'w-10 h-10'}
                      fill={'none'}
                      viewBox={'0 0 24 24'}
                      stroke={'#fff'}
                    >
                      <path
                        strokeLinecap={'round'}
                        strokeLinejoin={'round'}
                        strokeWidth={2}
                        d={
                          'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
                        }
                      />
                    </svg>
                  </div>
                </CopyToClipboard>
              </div>
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
            className={'mb-2 rounded-full py-1 px-24 ripple-bg-purple-600 text-white'}
            onClick={this.saveConfiguration}
          >
            Save
          </button>
        </div>

        <StatusMessage displayType={this.state.statusMessage.displayType} />
      </div>
    );
  }
}
