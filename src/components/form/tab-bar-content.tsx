import React from 'react';

export default class TabBarContent extends React.Component {
  public render(): JSX.Element {
    return <>{this.props.children}</>;
  }
}
