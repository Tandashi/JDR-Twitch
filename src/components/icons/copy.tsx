import React from 'react';

export default class CopyIcon extends React.Component {
  public render(): JSX.Element {
    return (
      <svg
        xmlns={'http://www.w3.org/2000/svg'}
        className={'w-6 h-6'}
        fill={'none'}
        viewBox={'0 0 24 24'}
        stroke={'#fff'}
      >
        <path
          strokeLinecap={'round'}
          strokeLinejoin={'round'}
          strokeWidth={1}
          d={
            'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
          }
        />
      </svg>
    );
  }
}
