import React, { ChangeEvent } from 'react';

import { IUpdateChatIntegrationConfiguration, IUpdateStreamerConfiguration } from '@models/streamer-configuration';

import ToggleButton from '@components/form/toggle';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionHeaderAnnoatation from '@components/configuration/section-header-annotation';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';

interface Props {
  initialConfiguration: IUpdateChatIntegrationConfiguration;
  updateConfiguration: (configuration: Partial<IUpdateStreamerConfiguration>) => void;
}

interface State {
  configuration: IUpdateChatIntegrationConfiguration;
}

export default class ChatIntegrationConfigurationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configuration: this.props.initialConfiguration,
    };

    this.handleEnabledToggle = this.handleEnabledToggle.bind(this);
    this.handleBanlistFormatChange = this.handleBanlistFormatChange.bind(this);
  }

  private handleEnabledToggle(): void {
    const newConfiguration = {
      ...this.state.configuration,
      enabled: !this.state.configuration.enabled,
    };

    this.props.updateConfiguration({
      chatIntegration: newConfiguration,
    });

    this.setState({
      configuration: newConfiguration,
    });
  }

  private handleBanlistFormatChange(e: ChangeEvent<HTMLInputElement>): void {
    const newConfiguration = {
      ...this.state.configuration,
      banlistFormat: e.target.value,
    };

    this.props.updateConfiguration({
      chatIntegration: newConfiguration,
    });

    this.setState({
      configuration: newConfiguration,
    });
  }

  public render(): JSX.Element {
    return (
      <ConfigurationContent>
        <Section>
          <SectionHeader title={'Information'}>
            <p>
              If enable will add the
              <a className={'font-medium text-blue-300'} href={'https://www.twitch.tv/justdancerequests'}>
                &nbsp;JustDanceRequests&nbsp;
              </a>
              Bot to your channel.
            </p>
            <p>Commands: !sr, !banlist</p>

            <SectionHeaderAnnoatation text={'Note'} color={'red'}>
              Banlist will not be enforced for songs requested via chat
            </SectionHeaderAnnoatation>
          </SectionHeader>
          <SectionContent>
            <div className={'flex flex-1 flex-row items-center space-x-4'}>
              <p className={'text-xs md:text-base text-white'}>Enable</p>
              <ToggleButton
                id={'chat-integration-toggle'}
                checked={this.state.configuration.enabled}
                onToggle={this.handleEnabledToggle}
              />
            </div>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader title={'Formatting Guide'}>
            <p>
              <a className={'bg-gray-700 p-1 rounded font-mono'}>{'{TITLE}'}</a> - Title of the Song
            </p>
            <p>
              <a className={'bg-gray-700 p-1 rounded font-mono'}>{'{ARTIST}'}</a> - Artist of the Song
            </p>

            <SectionHeaderAnnoatation text={'Example'} color={'yellow'} classNames={'space-y-2'}>
              <p>
                <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>{'{TITLE} - {ARTIST}'}</a> ➔
                {' "Bad Habits - Ed Sheeran"'}
              </p>
              <p>
                <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>{'{TITLE}'}</a> ➔ {'"Bad Habits"'}
              </p>
              <p>
                <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>{'{ARTIST}'}</a> ➔ {'"Ed Sheeran"'}
              </p>
            </SectionHeaderAnnoatation>
          </SectionHeader>
          <SectionContent>
            <div className={'flex flex-1 flex-row items-center space-x-4'}>
              <p className={'text-xs md:text-base text-white'}>Banlist Format</p>
              <input
                className={'flex-1 font-mono text-xs md:text-base rounded bg-gray-600 p-1'}
                spellCheck={false}
                value={this.state.configuration.commands.banlist.format}
                onChange={this.handleBanlistFormatChange}
              />
            </div>
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
