import React from 'react';

export default class InformationBox extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={'text-xs md:text-sm text-white mb-2 rounded bg-gray-600 p-3 border-l-4 border-gray-700'}>
        {this.props.children}
      </div>
    );
  }
}
