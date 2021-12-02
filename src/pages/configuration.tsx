import React from 'react';

import ESBService, { ESBApiResponse } from '@services/esb-api-service';

import IStreamerData from '@models/streamerdata';
import ISongData from '@models/songdata';
import { Result } from '@models/result';
import {
  IUpdateProfile,
  IUpdateStreamerConfiguration,
  IUpdateThemeConfiguration,
} from '@models/streamer-configuration';

import TabBar from '@components/form/tab-bar';
import LoadingIndicator from '@components/form/loading-indicator';

import ChatIntegrationConfigurationPage from '@pages/configuration/chat-integration';
import IntegrationsConfigurationPage from '@pages/configuration/integrations';
import GameConfigurationPage from '@pages/configuration/game';
import BanlistConfigurationPage from '@pages/configuration/banlist';
import ThemeConfigurationPage from '@pages/configuration/theme';
import TabBarContent from '@components/form/tab-bar-content';
import TabBarAccessories from '@components/form/tab-bar-accessories';
import ResultButton from '@components/form/result-buttons';

interface Props {}

interface State {
  fetch: {
    loading: boolean;
    games: string[];
    songs: ISongData[];
  };
  tabBar: {
    index: number;
  };
  streamerData: IStreamerData;
  configuration: IUpdateStreamerConfiguration;
  profile: IUpdateProfile;
}

export default class ConfigurationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fetch: {
        loading: false,
        games: [],
        songs: [],
      },
      tabBar: {
        index: 0,
      },
      streamerData: {
        channelId: '-1',
        configuration: undefined,
        queue: undefined,
        secret: 'SECRET-HERE',
      },
      configuration: {
        theme: {
          liveConfig: {
            css: '',
          },
        },
        chatIntegration: {
          enabled: false,
          announcements: {
            queue: {
              status: {
                opened: false,
                closed: false,
                cleared: false,
              },
              song: {
                fromChat: false,
                fromExtension: false,
                nextUp: false,
              },
            },
          },
          commands: {
            songRequest: {
              enabled: false,
            },
            queue: {
              enabled: false,
            },
            queuePosition: {
              enabled: false,
            },
            banlist: {
              enabled: false,
              format: '',
            },
          },
        },
        requests: {
          perUser: 1,
          duplicates: false,
        },
      },
      profile: {
        game: '',
        unlimited: false,
        banlist: {},
      },
    };

    this.handleConfigurationUpdate = this.handleConfigurationUpdate.bind(this);
    this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
    this.handleTabBarSelect = this.handleTabBarSelect.bind(this);
    this.handleTabBarSave = this.handleTabBarSave.bind(this);
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      fetch: {
        ...this.state.fetch,
        loading: true,
      },
    });

    await Promise.all([this.loadConfiguration(), this.loadGames(), this.loadSongs()]);

    this.setState({
      fetch: {
        ...this.state.fetch,
        loading: false,
      },
    });
  }

  async loadGames(): Promise<Result<ESBApiResponse<string[]>, any>> {
    const responseResult = await ESBService.getGames();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({
          fetch: {
            ...this.state.fetch,
            games: responseResult.data.data,
          },
        });
      }
    }

    return responseResult;
  }

  async loadSongs(): Promise<Result<ESBApiResponse<ISongData[]>, any>> {
    const responseResult = await ESBService.loadFilteredSongs(true);

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({
          fetch: {
            ...this.state.fetch,
            songs: responseResult.data.data,
          },
        });
      }
    }

    return responseResult;
  }

  private async loadConfiguration(): Promise<Result<ESBApiResponse<IStreamerData>, any>> {
    const responseResult = await ESBService.getStreamerData();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        const streamerData = responseResult.data.data;
        const songConfiguration = streamerData.configuration.profile.active.configuration.song;

        const banlist: {
          [key: string]: ISongData;
        } = {};

        streamerData.configuration.profile.active.banlist.forEach((e) => {
          banlist[e.id] = e;
        });

        this.setState({
          streamerData: streamerData,
          configuration: {
            theme: streamerData.configuration.theme,
            chatIntegration: streamerData.configuration.chatIntegration,
            requests: streamerData.configuration.requests,
          },
          profile: {
            game: songConfiguration.game,
            unlimited: songConfiguration.unlimited,
            banlist: banlist,
          },
        });
      }
    }

    return responseResult;
  }

  private handleConfigurationUpdate(configuration: Partial<IUpdateStreamerConfiguration>): void {
    this.setState({
      configuration: {
        ...this.state.configuration,
        ...configuration,
      },
    });
  }

  private handleProfileUpdate(profile: Partial<IUpdateProfile>, forceUpdate: boolean = false): void {
    const newProfile = {
      ...this.state.profile,
      ...profile,
    };

    if (forceUpdate) {
      this.updateProfile(newProfile);
    }

    this.setState({
      profile: newProfile,
    });
  }

  private async updateProfile(profile: IUpdateProfile): Promise<Result<ESBApiResponse<any>, any>[]> {
    this.setState({
      fetch: {
        ...this.state.fetch,
        loading: true,
      },
    });

    const updateResult = await ESBService.updateProfile(profile);
    const songResult = await this.loadSongs();

    this.setState({
      fetch: {
        ...this.state.fetch,
        loading: false,
      },
    });

    return [updateResult, songResult];
  }

  private handleTabBarSelect(index: number): void {
    this.setState({
      tabBar: {
        index: index,
      },
    });
  }

  private async handleTabBarSave(): Promise<Result<ESBApiResponse<any>, any>[]> {
    return Promise.all([
      ESBService.updateConfiguration(this.state.configuration),
      ESBService.updateProfile(this.state.profile),
    ]);
  }

  public render(): JSX.Element {
    return (
      <div className={'configuration flex h-full w-full'}>
        {this.state.fetch.loading ? (
          <LoadingIndicator />
        ) : (
          <TabBar
            onSelect={this.handleTabBarSelect}
            selectedIndex={this.state.tabBar.index}
            tabNames={['Chat Integration', 'Game', 'Banlist', 'Integrations', 'Theme']}
          >
            <TabBarAccessories>
              <div className={'px-2 py-1'}>
                <ResultButton text={'Save changes'} duration={1500} onClick={this.handleTabBarSave} />
              </div>
            </TabBarAccessories>
            <TabBarContent>
              <ChatIntegrationConfigurationPage
                initialConfiguration={this.state.configuration.chatIntegration}
                updateConfiguration={this.handleConfigurationUpdate}
              />
              <GameConfigurationPage
                initialConfiguration={this.state.profile}
                updateProfile={this.handleProfileUpdate}
                games={this.state.fetch.games.map((v) => {
                  return { value: v, label: v };
                })}
              />
              <BanlistConfigurationPage
                initialConfiguration={this.state.profile}
                songs={this.state.fetch.songs}
                updateProfile={this.handleProfileUpdate}
              />
              <IntegrationsConfigurationPage streamerData={this.state.streamerData} />
              <ThemeConfigurationPage
                initialConfiguration={this.state.configuration.theme}
                updateConfiguration={this.handleConfigurationUpdate}
              />
            </TabBarContent>
          </TabBar>
        )}
      </div>
    );
  }
}
