import React from 'react';

import InformationBox from '@components/configuration/information-box';

interface Props {
  title?: string;
  color?: string;
}

export default class SectionHeader extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <InformationBox color={this.props.color}>
        <div className='flex flex-col space-y-2'>
          {this.props.title ? (
            <>
              <p className='text-sm md:text-base font-bold'>{this.props.title}</p>
              {this.props.children ? <hr className='border-solid border-gray-500 rounded' /> : undefined}
            </>
          ) : undefined}
          {this.props.children ? <div className={'space-y-2'}>{this.props.children}</div> : undefined}
        </div>
      </InformationBox>
    );
  }
}
