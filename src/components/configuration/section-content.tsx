import React from 'react';

export default class SectionContent extends React.Component {
  public render(): JSX.Element {
    return <div className={`flex flex-1 flex-col justify-center space-y-4`}>{this.props.children}</div>;
  }
}
