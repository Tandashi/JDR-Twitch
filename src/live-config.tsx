import React from 'react';
import ReactDOM from 'react-dom';

import LiveConfig from '@pages/live-config';
import ConfigService from '@services/config-service';

window.Twitch.ext.onAuthorized((auth) => {
  const config = ConfigService.getConfig();
  ConfigService.setConfig({
    ...config,
    twitch: {
      auth: auth,
    },
  });
});

const config = ConfigService.getConfig();
ConfigService.setConfig({
  ...config,
  ebs: {
    ...config.ebs,
    api: {
      secret: new URL(window.location.href).searchParams.get('secret'),
    },
  },
});

ReactDOM.render(<LiveConfig />, document.getElementById('root'));
