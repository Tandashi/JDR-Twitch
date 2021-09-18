import React from 'react';

import Rating from '@components/rating/rating';

import '@styles/components/rating/rating-display.sass';

export enum RatingDisplayPosition {
  LEFT = 'left',
  MIDDLE = 'middle',
  RIGHT = 'right',
}

interface Props {
  value: number | undefined;
  maxValue: number;
  text: string;
  position: RatingDisplayPosition;
}

export default class RatingDisplay extends React.Component<Props> {
  public render(): JSX.Element {
    const position = this.props.position.toString();

    return (
      <div
        className={`rating-display rating-display-${position} flex flex-col self-center items-center w-full p-2 space-y-2`}
      >
        <div className={'flex-1'}>
          <Rating value={this.props.value} maxValue={this.props.maxValue} />
        </div>
        <div className={'flex-1'}>
          <p className={'rating-display-text text-white'}>{this.props.text}</p>
        </div>
      </div>
    );
  }
}
