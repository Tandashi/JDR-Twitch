import React from 'react';
import MonacoEditor from '@monaco-editor/react';

import Accordion from '@components/form/accordion';
import Section from '@components/configuration/section';
import SectionHeader from '@components/configuration/section-header';
import SectionHeaderAnnotation from '@components/configuration/section-header-annotation';
import SectionContent from '@components/configuration/section-content';
import ConfigurationContent from '@components/configuration/configuration-content';
import { IUpdateStreamerConfiguration, IUpdateThemeConfiguration } from '@models/streamer-configuration';

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
            <p>TODO LINK DOCUMENTATION HERE</p>
            <SectionHeaderAnnotation text={'Note'} color={'red'}>
              Be careful with what you paste here! Do NOT just copy sytles from the Internet without checking them.
            </SectionHeaderAnnotation>
          </SectionHeader>
          <SectionContent>
            <Accordion title='Queue Overview Page' isOpen={false}>
              <Section isSubSection={true}>
                <SectionHeader>
                  <p>Theme the Queue Overview page</p>
                  <p>TODO LINK DOCUMENTATION TO QUEUE OVERVIEW PAGE HERE</p>
                </SectionHeader>
                <SectionContent>
                  <MonacoEditor
                    height='50vh'
                    theme='vs-dark'
                    language='css'
                    value={this.state.configuration.liveConfig.css}
                    onChange={this.handleLiveConfigCssChange}
                    options={{
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
