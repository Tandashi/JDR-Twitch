import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import IStreamerData from '@models/streamerdata';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionHeaderAnnotation from '@components/configuration/section-header-annotation';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';
import ConfigService from '@services/config-service';
import TextLink from '@components/links/text-link';
import CopyIcon from '@components/icons/copy';

interface Props {
  streamerData: IStreamerData;
}

export default class IntegrationsConfigurationPage extends React.Component<Props> {
  private getIntegrationUrl(): string {
    const config = ConfigService.getConfig();
    return `${config.ebs.baseUrl}/streamlabs/integration?secret=${this.props.streamerData?.secret}`;
  }

  private getIntegrationEmbedUrl(): string {
    const config = ConfigService.getConfig();
    return `${config.ebs.baseUrl}/streamlabs/integration?secret=${this.props.streamerData?.secret}&embed`;
  }

  public render(): JSX.Element {
    return (
      <ConfigurationContent>
        <Section>
          <SectionHeader title={'Livestream Software Integration'}>
            <p>Copy the link and add it to your livestreaming software like OBS or Streamlabs</p>

            <p>
              If your are unsure on how to do it, please check out the{' '}
              <TextLink
                text='Configuration Guide'
                url='https://github.com/Tandashi/JDR-Twitch/wiki/Configuration-Guide'
              />
            </p>

            <SectionHeaderAnnotation text={'Tip'} color={'gray'} classNames='pt-4'>
              There are two variants to choose from. One variant for the streamer which includes all the controls (e.g.
              open/close queue, select the next song, ...) and one that can be used to display the Queue in stream to
              the viewer without any controls.
            </SectionHeaderAnnotation>
            <SectionHeaderAnnotation text={'Note'} color={'red'}>
              Do NOT share this link with anyone!
            </SectionHeaderAnnotation>
          </SectionHeader>
          <SectionContent>
            <div className='flex flex-1 flex-row space-x-4'>
              <CopyToClipboard text={this.getIntegrationUrl()}>
                <div
                  className={
                    'flex flex-1 items-center justify-center mt-2 p-2 rounded ripple-bg-purple-600 cursor-pointer space-x-2'
                  }
                >
                  <p className='text-white'>Copy (Streamer with controls)</p>
                  <CopyIcon />
                </div>
              </CopyToClipboard>
              <CopyToClipboard text={this.getIntegrationEmbedUrl()}>
                <div
                  className={
                    'flex flex-1 items-center justify-center mt-2 p-2 rounded ripple-bg-purple-600 cursor-pointer space-x-2'
                  }
                >
                  <p className='text-white'>Copy (Viewer without controls)</p>
                  <CopyIcon />
                </div>
              </CopyToClipboard>
            </div>
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
