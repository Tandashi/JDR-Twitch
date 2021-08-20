import React from 'react';

import '@styles/unauthorized.sass';

export default class UnauthorizedPage extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={'unauthorized h-full w-full flex items-center justify-center overflow-hidden select-none'}>
          <p className={'p-4 text-sm md:text-base'}>Unauthorized. Please make sure that your UserID is linked / you have granted permissions.</p>
      </div>
    );
  }
}
