import React from 'react';

interface Props {
  url: string;
  shield: {
    name: string;
    color: string;
    logo: string;
    logoColor: string;
  };
}

export default class ShieldLink extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <a target='_blank' href={this.props.url}>
        <img
          src={`https://img.shields.io/badge/${this.props.shield.name}-${this.props.shield.color}?style=for-the-badge&logo=${this.props.shield.logo}&logoColor=${this.props.shield.logoColor}`}
        />
      </a>
    );
  }
}
