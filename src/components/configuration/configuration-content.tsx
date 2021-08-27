import React from 'react';

export default class ConfigurationContent extends React.Component {
  public render(): JSX.Element {
    return <div className={'flex flex-col flex-1 p-4 space-y-3 overflow-auto'}>{this.props.children}</div>;
  }
}
