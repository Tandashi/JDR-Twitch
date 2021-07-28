import React from 'react';

import ISongData from '@models/songdata';
import RatingDisplay, { RatingDisplayPosition } from '@components/rating/rating-display';

interface Props {
  songdata: ISongData;
}

export default class SongStats extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'flex flex-row no-wrap space-x-2'}>
        <RatingDisplay
          value={this.props.songdata.difficulty}
          maxValue={4}
          position={RatingDisplayPosition.LEFT}
          text={'Difficulty'}
        />
        <RatingDisplay
          value={this.props.songdata.coaches}
          maxValue={4}
          position={RatingDisplayPosition.MIDDLE}
          text={'Coaches'}
        />
        <RatingDisplay
          value={this.props.songdata.effort}
          maxValue={3}
          position={RatingDisplayPosition.RIGHT}
          text={'Effort'}
        />
      </div>
    );
  }
}
