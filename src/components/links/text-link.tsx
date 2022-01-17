import React from 'react';

interface Props {
  text: string;
  url: string;
}

export default class TextLink extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <a target='_blank' className='font-medium text-blue-300' href={this.props.url}>
        {this.props.text}
      </a>
    );
  }
}
