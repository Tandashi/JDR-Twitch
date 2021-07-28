import React from 'react';
import RatingPoint, { RatingPointStatus } from './rating-point';

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
      <div className={'flex-1'}>
        <RatingPoint status={this.getStatus(i)} />
      </div>
    ));
  }

  public render(): JSX.Element {
    return <div className={`flex flex-row`}>{...this.generateRatingPoints()}</div>;
  }
}
