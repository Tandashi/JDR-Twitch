import React from 'react';

import RatingPoint, { RatingPointStatus } from '@components/rating/rating-point';

interface Props {
  value: number | undefined;
  maxValue: number;
}

export default class Rating extends React.Component<Props> {
  getStatus(index: number): RatingPointStatus {
    if (!this.props.value) {
      return RatingPointStatus.UNKNOWN;
    }

    // < since we are dealing with incidies
    return index < this.props.value ? RatingPointStatus.ACTIVE : RatingPointStatus.INACTIVE;
  }

  generateRatingPoints(): JSX.Element[] {
    return Array.from<any, JSX.Element>(Array(this.props.maxValue), (_, i) => (
      <div className={'flex-1 h-full'}>
        <RatingPoint status={this.getStatus(i)} />
      </div>
    ));
  }

  public render(): JSX.Element {
    return <div className={`flex flex-row space-x-2 h-full`}>{...this.generateRatingPoints()}</div>;
  }
}
