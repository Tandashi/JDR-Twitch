import React, { ChangeEvent } from 'react';
import lodash from 'lodash';

import { IUpdateChatIntegrationConfiguration, IUpdateStreamerConfiguration } from '@models/streamer-configuration';

import ToggleButton from '@components/form/toggle';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionHeaderAnnotation from '@components/configuration/section-header-annotation';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';
import Accordion from '@components/form/accordion';
import TextLink from '@components/links/text-link';

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

  private handleEnabledToggle(path: string, pathAddons: string[] = []): () => void {
    return () => {
      const enabledPath = [...path.split('.').filter((e) => e !== ''), ...pathAddons];
      const enabled = !lodash.get(this.state.configuration, enabledPath);

      const newConfiguration = {
        ...this.state.configuration,
      };

      lodash.set(newConfiguration, enabledPath, enabled);

      this.props.updateConfiguration({
        chatIntegration: newConfiguration,
      });

      this.setState({
        configuration: newConfiguration,
      });
    };
  }

  private handleBanlistFormatChange(e: ChangeEvent<HTMLInputElement>): void {
    const newConfiguration = {
      ...this.state.configuration,
      commands: {
        ...this.state.configuration.commands,
        banlist: {
          enabled: this.state.configuration.commands.banlist.enabled,
          format: e.target.value,
        },
      },
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
          <SectionHeader>
            <p>
              If enable will add the
              <TextLink text='&nbsp;JustDanceRequests&nbsp;' url='https://www.twitch.tv/justdancerequests' />
              Bot to your channel.
            </p>

            <SectionHeaderAnnotation text={'Note'} color={'red'}>
              Banlist will not be enforced for songs requested via chat
            </SectionHeaderAnnotation>
          </SectionHeader>
          <SectionContent>
            <div className={'flex flex-1 flex-row items-center space-x-4'}>
              <p className={'text-xs md:text-base text-white'}>Enable</p>
              <ToggleButton
                id={'chat-integration-toggle'}
                checked={this.state.configuration.enabled}
                onToggle={this.handleEnabledToggle('', ['enabled'])}
              />
            </div>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader title={'Announcement Configuration'}>
            <p>Configure the different chat announcements</p>
          </SectionHeader>
          <SectionContent>
            <Accordion title='Queue opened' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>Enable to allow the chat bot to make announcements when the Queue opens.</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>

                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.announcements.queue.status.opened}
                      onToggle={this.handleEnabledToggle('announcements.queue.status.opened')}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>
            <Accordion title='Queue closed' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>Enable to allow the chat bot to make announcements when the Queue closes.</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>

                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.announcements.queue.status.closed}
                      onToggle={this.handleEnabledToggle('announcements.queue.status.closed')}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>
            <Accordion title='Queue cleared' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>Enable to allow the chat bot to make announcements when the Queue is cleared.</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>

                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.announcements.queue.status.cleared}
                      onToggle={this.handleEnabledToggle('announcements.queue.status.cleared')}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>
            <Accordion title='Song added from Chat' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>Enable to allow the chat bot to make announcements when a song from chat has been added.</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>

                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.announcements.queue.song.fromChat}
                      onToggle={this.handleEnabledToggle('announcements.queue.song.fromChat')}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>
            <Accordion title='Song added from Extension' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    Enable to allow the chat bot to make announcements when a song from the Extension has been added.
                  </p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>

                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.announcements.queue.song.fromExtension}
                      onToggle={this.handleEnabledToggle('announcements.queue.song.fromExtension')}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>
            <Accordion title='Song Next Up' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>Enable to allow the chat bot to make announcements when the next song has been selected.</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>

                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.announcements.queue.song.nextUp}
                      onToggle={this.handleEnabledToggle('announcements.queue.song.nextUp')}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader title={'Command Configuration'}>
            <p>Configure the different Commands</p>
          </SectionHeader>
          <SectionContent>
            <Accordion title='Song Request Command' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    Enable to give viewers access to the{' '}
                    <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>!sr / !songrequest</a> command
                  </p>
                  <p>Using this command viewers can request songs via chat</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>
                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.commands.songRequest.enabled}
                      onToggle={this.handleEnabledToggle('commands.songRequest', ['enabled'])}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>

            <Accordion title='Leave Queue Command' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    Enable to give viewers access to the{' '}
                    <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>!l / !leave</a> command
                  </p>
                  <p>Using this command viewers can remove their request from the queue</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>
                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.commands.leave.enabled}
                      onToggle={this.handleEnabledToggle('commands.leave', ['enabled'])}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>

            <Accordion title='Queue Command' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    Enable to give viewers access to the{' '}
                    <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>!q / !queue</a> command
                  </p>
                  <p>Using this command viewers can check what songs are in the queue via chat</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>
                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.commands.queue.enabled}
                      onToggle={this.handleEnabledToggle('commands.queue', ['enabled'])}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>

            <Accordion title='Queue Position Command' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    Enable to give viewers access to the{' '}
                    <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>!qp / !queuePosition</a> command
                  </p>
                  <p>
                    Using this command viewers can check at what positions the songs they requested are in the queue
                  </p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>
                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.commands.queuePosition.enabled}
                      onToggle={this.handleEnabledToggle('commands.queuePosition', ['enabled'])}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>

            <Accordion title='Toggle Queue Command' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    Enable to give <b>moderators</b> access to the{' '}
                    <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>!oq / !openQueue</a> and{' '}
                    <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>!cq / !closeQueue</a> commands
                  </p>
                  <p>Using this command moderators can open the queue via chat</p>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>
                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.commands.toggleQueue.enabled}
                      onToggle={this.handleEnabledToggle('commands.toggleQueue', ['enabled'])}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>

            <Accordion title='Banlist Command' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    Enable to give viewers access to the{' '}
                    <a className={'text-xs bg-gray-700 p-1 rounded font-mono'}>!bl / !banlist</a> command
                  </p>

                  <p>Using this command viewers can see which songs are on the banlist via chat</p>

                  <SectionHeaderAnnotation text={'Note'} color={'red'}>
                    Banlist will not be enforced for songs requested via chat
                  </SectionHeaderAnnotation>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Enable</p>
                    <ToggleButton
                      id={'chat-integration-toggle'}
                      checked={this.state.configuration.commands.banlist.enabled}
                      onToggle={this.handleEnabledToggle('commands.banlist', ['enabled'])}
                    />
                  </div>
                </SectionContent>
              </Section>

              <Section isSubSection={true}>
                <SectionHeader title={'Formatting Guide'}>
                  <p>
                    <a className={'bg-gray-700 p-1 rounded font-mono'}>{'{TITLE}'}</a> - Title of the Song
                  </p>
                  <p>
                    <a className={'bg-gray-700 p-1 rounded font-mono'}>{'{ARTIST}'}</a> - Artist of the Song
                  </p>

                  <SectionHeaderAnnotation text={'Example'} color={'yellow'} classNames={'space-y-2'}>
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
                  </SectionHeaderAnnotation>
                </SectionHeader>
                <SectionContent>
                  <div className={'flex flex-1 flex-row items-center space-x-4'}>
                    <p className={'text-xs md:text-base text-white'}>Banlist Format</p>
                    <input
                      className={'flex-1 font-mono text-xs md:text-base rounded bg-gray-600 p-1 text-white'}
                      spellCheck={false}
                      value={this.state.configuration.commands.banlist.format}
                      onChange={this.handleBanlistFormatChange}
                    />
                  </div>
                </SectionContent>
              </Section>
            </Accordion>
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
