import React from 'react';

interface Props {
  selected: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default class Select extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'relative inline-flex text-xs md:text-sm'}>
        <svg
          className={'w-2 h-2 absolute top-0 right-0 m-4 retina-144:m-3 pointer-events-none'}
          xmlns={'http://www.w3.org/2000/svg'}
          viewBox={'0 0 412 232'}
        >
          <path
            d={
              'M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z'
            }
            fill={'#648299'}
            fill-rule={'nonzero'}
          />
        </svg>

        <select
          onChange={this.props.onChange}
          className={
            'border border-gray-300 rounded-full text-gray-600 h-10 retina-144:h-8 pl-5 retina-144:pl-3 pr-10 retina-144:pr-6 bg-white hover:border-gray-400 focus:outline-none appearance-none'
          }
        >
          {this.props.options.map((e) => {
            return <option selected={e === this.props.selected}>{e}</option>;
          })}
        </select>
      </div>
    );
  }
}
