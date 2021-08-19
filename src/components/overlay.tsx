import React from 'react';

import '@styles/components/overlay.sass';

export enum OverlayDirection {
  LEFT,
  RIGHT,
}

interface Props {
  isOpen: boolean;
  direction: OverlayDirection;
}

export default class Overlay extends React.Component<Props> {
  public render(): JSX.Element {
    const slideClass = this.props.isOpen ? 'slide-out' : 'slide-in';
    const fixturePoint = this.props.direction === OverlayDirection.LEFT ? 'left-0' : 'right-0';
    return (
      <div className={`overlay h-full w-full ${slideClass} fixed top-0 ${fixturePoint} z-10 overflow-x-hidden`}>
        {this.props.children}
      </div>
    );
  }
}
