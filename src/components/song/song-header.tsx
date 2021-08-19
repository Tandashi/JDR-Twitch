import React from 'react';

import ISongData from '@models/songdata';

import '@styles/components/song/song-header.sass';

interface Props {
  songdata: ISongData;
}

export default class SongHeader extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'song-header song-header-background select-none flex flex-row flex-nowrap rounded-r'}>
        <div className={'flex-grow-4 flex-shrink-0 flex-80 p-2 min-w-0 self-center'}>
          <p className={'text-sm md:text-base retina-144:text-base lg:text-lg truncate'}>{this.props.songdata.title}</p>
          <p className={'text-xs md:text-sm retina-144:text-sm lg:text-base truncate'}>{this.props.songdata.artist}</p>
        </div>
        <img
          className={'flex-shrink flex-20 rounded-r min-w-0'}
          draggable={false}
          src={this.props.songdata.image_url}
        />
      </div>
    );
  }
}
