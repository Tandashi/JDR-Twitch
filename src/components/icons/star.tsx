import React from 'react';

interface Props {
  fill: string;
}

export default class StarIcon extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        x='0px'
        y='0px'
        viewBox='0 0 512.021 512.021'
        xmlSpace='preserve'
        className='h-6 w-6'
      >
        <path
          fill='#fff'
          className={`fill-current text-${this.props.fill}`}
          d='M498.03,249.941c12.693-12.416,17.173-30.635,11.691-47.531c-5.504-16.917-19.883-29.035-38.315-31.701l-119.893-12.736
			c-1.301-0.192-2.347-0.896-2.24-0.576l-52.8-131.584c-7.573-15.339-22.336-24.96-41.408-25.707
			c-17.173,0.747-31.957,10.368-40.192,27.2l-51.499,128.619c-0.533,1.088-1.6,1.856-1.984,1.941L39.769,170.816
			c-17.6,2.56-31.979,14.677-37.461,31.595c-5.504,16.939-0.981,35.179,11.648,47.509l88.384,87.232
			c0.896,0.875,1.301,2.112,1.088,3.349L83.353,457.579c-3.008,17.536,4.075,34.944,18.475,45.419
			c8.128,5.909,17.664,8.917,27.243,8.917c7.381,0,14.805-1.792,21.653-5.397l105.429-55.275l105.131,55.275
			c15.744,8.277,34.496,6.933,48.917-3.52c14.4-10.475,21.483-27.883,18.453-45.419l-20.053-117.077
			c-0.213-1.237,0.171-2.475,1.152-3.435L498.03,249.941z'
        />
      </svg>
    );
  }
}
