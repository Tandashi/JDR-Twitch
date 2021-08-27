import React from 'react';

interface Props {
  text: string;
  color: 'red' | 'yellow';
  classNames?: string;
}

export default class SectionHeaderAnnotation extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={`${this.props.classNames ?? ''} mt-2`}>
        <b className={`font-medium text-${this.props.color}-300`}>{this.props.text}</b>: {this.props.children}
      </div>
    );
  }
}
