import React from 'react';

import ISongData from '@models/songdata';

interface Props {
  banned: boolean;
  songdata: ISongData;
  onClick: () => void;
}

export default class BanlistEntry extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'flex items-center justify-between p-2 rounded-full bg-gray-100 border-2'}>
        <div className={'flex items-center'}>
          <div
            onClick={this.props.onClick}
            className={'flex items-center justify-center h-12 w-12 rounded-full border mb-0 mr-3 cursor-pointer'}
          >
            {this.props.banned && (
              <svg
                className={'h-10 w-10'}
                xmlns={'http://www.w3.org/2000/svg'}
                fill={'none'}
                viewBox={'0 0 24 24'}
                stroke={'#f00'}
              >
                <path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d={'M6 18L18 6M6 6l12 12'} />
              </svg>
            )}
          </div>

          <div className={'flex flex-col'}>
            <div className={'text-sm leading-3 text-gray-700 font-bold w-full'}>{this.props.songdata.title}</div>
            <div className={'text-xs text-gray-600 w-full'}>{this.props.songdata.artist}</div>
          </div>
        </div>
      </div>
    );
  }
}
