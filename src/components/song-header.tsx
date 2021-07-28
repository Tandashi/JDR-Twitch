import React from 'react';

import '@styles/components/song-header.sass';
import ISongData from 'src/models/songdata';

interface Props {
  songdata: ISongData;
}

export default class SongHeader extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'song-header song-header-background select-none flex flex-row flex-nowrap rounded-r'}>
        <div className={'flex-grow-4 flex-shrink-0 flex-80 p-2 min-w-0 self-center'}>
          <p className={'song-header-title truncate'}>{this.props.songdata.title}</p>
          <p className={'song-header-artist truncate'}>{this.props.songdata.artist}</p>
        </div>
        <img className={'flex-shrink flex-20 rounded-r min-w-0'} draggable={false} src={this.props.songdata.img_url} />
      </div>
    );
  }
}
