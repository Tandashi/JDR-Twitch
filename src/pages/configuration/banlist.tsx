import React, { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import { IUpdateProfile } from '@models/streamer-configuration';
import ISongData from '@models/songdata';

import SearchBar from '@components/search/searchbar';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';
import BanlistOverview from '@components/banlist/banlist-overview';
import FilterService from '@services/filter-service';

interface Props {
  initialConfiguration: IUpdateProfile;
  songs: ISongData[];
  updateProfile: (configuration: Partial<IUpdateProfile>) => void;
}

interface State {
  configuration: IUpdateProfile;
  filteredSongs: ISongData[];
}

export default class BanlistConfigurationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configuration: this.props.initialConfiguration,
      filteredSongs: this.props.songs,
    };

    this.filterSongs = this.filterSongs.bind(this);
    this.handleBanToggle = this.handleBanToggle.bind(this);
  }

  private filterSongs(event: ChangeEvent<HTMLInputElement>): void {
    const filteredSongs = FilterService.filterSongs(this.props.songs, event.target.value);
    this.setState({
      filteredSongs,
    });
  }

  private handleBanToggle(songdata: ISongData): void {
    const banlist = {
      ...this.state.configuration.banlist,
    };

    if (this.state.configuration.banlist[songdata.id]) {
      delete banlist[songdata.id];
    } else {
      banlist[songdata.id] = songdata;
    }

    this.props.updateProfile({
      banlist: banlist,
    });

    this.setState({
      ...this.state,
      configuration: {
        ...this.state.configuration,
        banlist: banlist,
      },
    });
  }

  public render(): JSX.Element {
    return (
      <ConfigurationContent>
        <Section>
          <SectionHeader title={'Banned Songs'}>
            <p>The songs you would like to ban from being requested</p>
          </SectionHeader>
          <SectionContent>
            <SearchBar onChange={debounce(this.filterSongs, 300)} />

            <BanlistOverview
              songdata={this.state.filteredSongs}
              banlist={this.state.configuration.banlist}
              onBan={this.handleBanToggle}
            />
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
