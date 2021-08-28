import React from 'react';
import Select from 'react-select';

import { IUpdateProfile } from '@models/streamer-configuration';

import ToggleButton from '@components/form/toggle';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionHeaderAnnotation from '@components/configuration/section-header-annotation';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';

interface Props {
  initialConfiguration: IUpdateProfile;
  games: { value: string; label: string }[];
  updateProfile: (configuration: Partial<IUpdateProfile>, forceUpdate: boolean) => void;
}

interface State {
  configuration: IUpdateProfile;
}

export default class GameConfigurationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configuration: this.props.initialConfiguration,
    };

    this.handleUnlimitedToggle = this.handleUnlimitedToggle.bind(this);
    this.handleGameSelect = this.handleGameSelect.bind(this);
  }

  private handleUnlimitedToggle(): void {
    const newConfiguration = {
      ...this.state.configuration,
      unlimited: !this.state.configuration.unlimited,
    };

    this.props.updateProfile(newConfiguration, true);

    this.setState({
      configuration: newConfiguration,
    });
  }

  private handleGameSelect(selected: { value: string; label: string }): void {
    if (this.state.configuration.game === selected.value) {
      return;
    }

    const newConfiguration = {
      ...this.state.configuration,
      game: selected.value,
    };

    this.props.updateProfile(newConfiguration, true);

    this.setState({
      configuration: newConfiguration,
    });
  }

  public render(): JSX.Element {
    return (
      <ConfigurationContent>
        <Section>
          <SectionHeader title={'Game Version'}>
            <p>The Just Dance version you are using</p>
            <SectionHeaderAnnotation text={'Note'} color={'red'}>
              Changes will be automatically saved!
            </SectionHeaderAnnotation>
          </SectionHeader>
          <SectionContent>
            <Select
              className={'text-black text-xs md:text-sm w-1/3'}
              onChange={this.handleGameSelect}
              value={{ value: this.state.configuration.game, label: this.state.configuration.game }}
              options={this.props.games}
            />
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader title={'Just Dance Unlimited'}>
            <p>If you have Just Dance Unlimited</p>
            <SectionHeaderAnnotation text={'Note'} color={'red'}>
              Changes will be automatically saved!
            </SectionHeaderAnnotation>
          </SectionHeader>
          <SectionContent>
            <div className={'flex flex-1 flex-row items-center space-x-4'}>
              <p className={'text-xs md:text-base text-white'}>Unlimited</p>
              <ToggleButton
                id={'chat-integration-toggle'}
                checked={this.state.configuration.unlimited}
                onToggle={this.handleUnlimitedToggle}
              />
            </div>
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
