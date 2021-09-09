import React from 'react';

import InformationBox from '@components/configuration/information-box';

interface Props {
  title?: string;
  color?: string;
}

export default class SectionHeader extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <InformationBox color={this.props.color}>
        {this.props.title ? <p className={'text-sm md:text-base font-bold mb-2'}>{this.props.title}</p> : undefined}
        <div className={'space-y-2'}>{this.props.children}</div>
      </InformationBox>
    );
  }
}
