import React from 'react';

import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';
import ShieldLink from '@components/links/shield-link';
import SectionHeaderAnnotation from '@components/configuration/section-header-annotation';
import TextLink from '@components/links/text-link';

export default class AboutConfigurationPage extends React.Component {
  public render(): JSX.Element {
    return (
      <ConfigurationContent>
        <Section>
          <SectionHeader title={'Everything you need to know about the Project'}>
            <p>You can find all links to the project and it's components below.</p>

            <SectionHeaderAnnotation text={'Created by'} color={'red'} classNames='pt-4'>
              <TextLink text='Tandashi' url='https://www.twitch.tv/tandashii' />
            </SectionHeaderAnnotation>
          </SectionHeader>
          <SectionContent>
            <div className='flex flex-row space-x-2'>
              <ShieldLink
                url='https://twitter.com/JDR_Twitch'
                shield={{
                  name: 'Twitter',
                  color: '1DA1F2',
                  logo: 'twitter',
                  logoColor: 'white',
                }}
              />
              <ShieldLink
                url='https://github.com/Tandashi/JDR-Twitch'
                shield={{
                  name: 'GitHub (Project files and Guides)',
                  color: '100000',
                  logo: 'github',
                  logoColor: 'white',
                }}
              />
              <ShieldLink
                url='https://status.tandashi.de/status'
                shield={{
                  name: 'Server%20Status%20Page',
                  color: '6F4C5B',
                  logo: 'Statuspage',
                  logoColor: 'white',
                }}
              />
            </div>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader title={'Support the Project'}>
            <p>If you like the project, you can support it at the following places.</p>
            <p>Dontations are always appriciated but never needed.</p>
          </SectionHeader>
          <SectionContent>
            <ShieldLink
              url='https://ko-fi.com/tandashi'
              shield={{
                name: 'Ko--Fi',
                color: 'F16061',
                logo: 'ko-fi',
                logoColor: 'white',
              }}
            />
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
