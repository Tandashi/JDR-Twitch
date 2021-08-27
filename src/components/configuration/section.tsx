import React from 'react';

export default class Section extends React.Component {
  public render(): JSX.Element {
    const children = React.Children.toArray(this.props.children);

    let sectionHeader, sectionContent;

    for (const child of children) {
      switch ((child as any).type.name) {
        case 'SectionHeader':
          sectionHeader = child;
          break;
        case 'SectionContent':
          sectionContent = child;
          break;
      }
    }

    return (
      <div className={'flex flex-1 flex-col p-2 bg-gray-500 rounded'}>
        {sectionHeader}

        <div className={'p-3'}>{sectionContent}</div>
      </div>
    );
  }
}
