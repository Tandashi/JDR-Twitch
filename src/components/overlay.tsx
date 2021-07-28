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
    const width = this.props.isOpen ? 'w-full' : 'w-0';
    const fixturePoint = this.props.direction === OverlayDirection.LEFT ? 'left-0' : 'right-0';
    return (
      <div className={`overlay h-full fixed z-10 overflow-x-hidden top-0 ${fixturePoint} ${width}`}>
        {this.props.children}
      </div>
    );
  }
}
