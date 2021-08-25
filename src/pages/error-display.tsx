import React from 'react';

import '@styles/error-display.sass';

export default class ErrorDisplayPage extends React.Component {
  public render(): JSX.Element {
    return (
      <div
        className={
          'error-display h-full w-full p-2 flex align-center justify-center overflow-hidden select-none'
        }
      >
        <p className={'text-white text-center self-center justify-self-center'}>
          {this.props.children}
        </p>
      </div>
    );
  }
}
