import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import IStreamerData from '@models/streamerdata';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionHeaderAnnotation from '@components/configuration/section-header-annotation';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';
import ConfigService from '@services/config-service';

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
          <SectionHeader title={'Queue Streamlabs / OBS Integration'}>
            <p>Copy the link and add it as Browser Component in Streamlabs / OBS</p>
            <SectionHeaderAnnotation text={'Tip'} color={'gray'}>
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
                  <svg
                    xmlns={'http://www.w3.org/2000/svg'}
                    className={'w-6 h-6'}
                    fill={'none'}
                    viewBox={'0 0 24 24'}
                    stroke={'#fff'}
                  >
                    <path
                      strokeLinecap={'round'}
                      strokeLinejoin={'round'}
                      strokeWidth={1}
                      d={
                        'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
                      }
                    />
                  </svg>
                </div>
              </CopyToClipboard>
              <CopyToClipboard text={this.getIntegrationEmbedUrl()}>
                <div
                  className={
                    'flex flex-1 items-center justify-center mt-2 p-2 rounded ripple-bg-purple-600 cursor-pointer space-x-2'
                  }
                >
                  <p className='text-white'>Copy (Viewer without controls)</p>
                  <svg
                    xmlns={'http://www.w3.org/2000/svg'}
                    className={'w-6 h-6'}
                    fill={'none'}
                    viewBox={'0 0 24 24'}
                    stroke={'#fff'}
                  >
                    <path
                      strokeLinecap={'round'}
                      strokeLinejoin={'round'}
                      strokeWidth={1}
                      d={
                        'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
                      }
                    />
                  </svg>
                </div>
              </CopyToClipboard>
            </div>
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
