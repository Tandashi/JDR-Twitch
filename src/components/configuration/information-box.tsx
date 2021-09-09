import React from 'react';

interface Props {
  color?: string;
}

export default class InformationBox extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div
        className={`text-xs md:text-sm text-white mb-2 rounded bg-${
          this.props.color ?? 'gray'
        }-600 p-3 border-l-4 border-${this.props.color ?? 'gray'}-700`}
      >
        {this.props.children}
      </div>
    );
  }
}
