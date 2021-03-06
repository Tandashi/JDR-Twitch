import React from 'react';

interface Props {
  id: string;
  checked: boolean;
  onToggle: () => void;
}

export default class ToggleButton extends React.Component<Props> {
  public render(): JSX.Element {
    const classesContainer = this.props.checked ? 'bg-purple-600' : 'bg-gray-400';
    const classesThumb = this.props.checked ? 'transform translate-x-full' : '';
    return (
      <div id={this.props.id} className={'inline-flex items-center cursor-pointer'}>
        <span className={'relative'} onClick={this.props.onToggle}>
          <span className={`block w-10 retina-144:w-8 h-6 retina-144:h-5 rounded-full shadow-inner ${classesContainer}`} />
          <span
            className={`absolute block w-4 retina-144:w-3 h-4 retina-144:h-3 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-white ${classesThumb}`}
          >
            <input type={'checkbox'} className={'absolute opacity-0 w-0 h-0'} />
          </span>
        </span>
      </div>
    );
  }
}
