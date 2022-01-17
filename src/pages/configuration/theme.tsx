import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import 'monaco-editor/esm/vs/basic-languages/css/css.contribution.js';

import Accordion from '@components/form/accordion';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionHeaderAnnotation from '@components/configuration/section-header-annotation';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';
import { IUpdateStreamerConfiguration, IUpdateThemeConfiguration } from '@models/streamer-configuration';
import TextLink from '@components/links/text-link';

interface Props {
  initialConfiguration: IUpdateThemeConfiguration;
  updateConfiguration: (configuration: Partial<IUpdateStreamerConfiguration>) => void;
}

interface State {
  configuration: IUpdateThemeConfiguration;
}

export default class ThemeConfigurationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configuration: this.props.initialConfiguration,
    };

    this.handleLiveConfigCssChange = this.handleLiveConfigCssChange.bind(this);
  }

  private handleLiveConfigCssChange(value: string): void {
    const newConfiguration = {
      ...this.state.configuration,
      liveConfig: {
        css: value,
      },
    };

    this.props.updateConfiguration({
      theme: newConfiguration,
    });

    this.setState({
      configuration: newConfiguration,
    });
  }

  public render(): JSX.Element {
    return (
      <ConfigurationContent>
        <Section>
          <SectionHeader title={'Theme'}>
            <p>Custom theming of the Extension to make it more unique.</p>
            <p>
              <TextLink text='Theming Documentation' url='https://github.com/Tandashi/JDR-Twitch/wiki/Theming-Guide' />
            </p>

            <SectionHeaderAnnotation text={'Attention'} color={'yellow'} classNames='pt-4'>
              Requires <TextLink text='CSS' url='https://en.wikipedia.org/wiki/CSS' /> knowledge.
            </SectionHeaderAnnotation>

            <SectionHeaderAnnotation text={'Note'} color={'red'}>
              Be careful with what you paste here! Do NOT just copy sytles from the Internet without checking them.
            </SectionHeaderAnnotation>
          </SectionHeader>
          <SectionContent>
            <Accordion title='Queue Overview Page' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>
                    The custom <TextLink text='CSS' url='https://en.wikipedia.org/wiki/CSS' /> for the Queue overview
                    page.
                  </p>
                  <p>
                    <TextLink
                      text='Theming Documentation'
                      url='https://github.com/Tandashi/JDR-Twitch/wiki/Theming-Guide'
                    />
                  </p>
                </SectionHeader>
                <SectionContent>
                  <MonacoEditor
                    height='50vh'
                    theme='vs-dark'
                    language='css'
                    value={this.state.configuration.liveConfig.css}
                    onChange={this.handleLiveConfigCssChange}
                    options={{
                      automaticLayout: true,
                      minimap: {
                        enabled: false,
                      },
                    }}
                  />
                </SectionContent>
              </Section>
            </Accordion>
          </SectionContent>
        </Section>
      </ConfigurationContent>
    );
  }
}
