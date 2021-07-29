import React from 'react';

import ISongData from '@models/songdata';

import '@styles/components/song/song-preview.sass';

interface Props {
  songdata: ISongData;
}

export default class SongPreview extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'song-preview flex h-full rounded-lg justify-center'}>
        {this.props.songdata.preview_video_url ? (
          <div className={'self-center justify-self-center'}>
            <video
              className={'rounded-lg'}
              loop={true}
              autoPlay={true}
              muted={true}
              src={this.props.songdata.preview_video_url}
            />
          </div>
        ) : (
          <p className={'song-preview-text flex-1 self-center text-center'}>No preview available :(</p>
        )}
      </div>
    );
  }
}
