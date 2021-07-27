import React from 'react';

import '@styles/components/search-entry.sass';
import ISongData from 'src/models/songdata';

interface Props {
  songdata: ISongData;
}

export default class SearchEntry extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'flex flex-row flex-nowrap search-entry search-entry-background rounded'}>
        <img className={'flex-shrink flex-20 rounded-l min-w-0'} src={this.props.songdata.img_url} />
        <div className={'flex-grow-4 flex-shrink-0 flex-80 p-2 min-w-0 self-center'}>
          <p className={'search-entry-text search-entry-title truncate'}>{this.props.songdata.title}</p>
          <p className={'search-entry-text search-entry-artist truncate'}>{this.props.songdata.artist}</p>
        </div>
      </div>
    );
  }
}
