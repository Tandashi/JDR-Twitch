import React from 'react';
import ReactDOM from 'react-dom';

import Queue from '@pages/queue';
import ConfigService from '@services/config-service';

const config = ConfigService.getConfig();
ConfigService.setConfig({
  ...config,
  api: {
    secret: new URL(window.location.href).searchParams.get('secret'),
  },
});

ReactDOM.render(<Queue />, document.getElementById('root'));
