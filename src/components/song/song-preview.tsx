import React from 'react';

import ISongData from '@models/songdata';

import '@styles/components/song/song-preview.sass';

interface Props {
  songdata: ISongData;
}

export default class SongPreview extends React.Component<Props> {
  public render(): JSX.Element {
    return this.props.songdata.preview_video_url ? (
      <video autoPlay={true} muted={true} src={this.props.songdata.preview_video_url} />
    ) : (
      <div className={'self-center'}>
        <p className={'song-preview-text'}>No preview available :(</p>
      </div>
    );
  }
}
