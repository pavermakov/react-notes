import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/app/App';
import registerServiceWorker from './registerServiceWorker';

import 'assets/styles/base/index.less';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
