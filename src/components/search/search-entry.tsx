import React from 'react';

import '@styles/components/search/search-entry.sass';
import ISongData from '@models/songdata';

interface Props {
  songdata: ISongData;
  onClick: () => void;
}

export default class SearchEntry extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div
        className={'search-entry search-entry-background flex flex-row flex-nowrap rounded cursor-pointer'}
        onClick={() => this.props.onClick()}
      >
        <img
          className={'flex-shrink flex-20 rounded-l min-w-0'}
          draggable={false}
          src={this.props.songdata.image_url}
          loading='lazy'
        />
        <div className={'flex-grow-4 flex-shrink-0 flex-80 p-2 min-w-0 self-center text-white'}>
          <p className={'text-sm md:text-base retina-144:text-base lg:text-lg truncate'}>{this.props.songdata.title}</p>
          <p className={'text-xs md:text-sm retina-144:text-sm lg:text-base truncate'}>{this.props.songdata.artist}</p>
        </div>
      </div>
    );
  }
}
