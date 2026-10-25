/*
 * <license header>
 */


import { createRoot } from 'react-dom/client';
import Runtime, { init } from '@adobe/exc-app';
import App from './components/App';
import './index.css';

window.React = require('react');

try {
  require('./exc-runtime');
  init(bootstrapInExcShell);
} catch (e) {
  console.log('application not running in Adobe Experience Cloud Shell');
  bootstrapRaw();
}

function bootstrapRaw () {
  const mockRuntime = { on: () => {} };
  const mockIms = {};
  createRoot(document.getElementById('root')).render(
    <App runtime={mockRuntime} ims={mockIms} />,
  );
}

function bootstrapInExcShell () {
  const runtime = Runtime();

  runtime.on('ready', ({ imsOrg, imsToken, imsProfile, locale }) => {
    runtime.done();
    console.log('Ready! received imsProfile:', imsProfile);
    const ims = {
      profile: imsProfile,
      org: imsOrg,
      token: imsToken,
    };
    createRoot(document.getElementById('root')).render(
      <App runtime={runtime} ims={ims} />,
    );
  });

  runtime.solution = {
    icon: 'AdobeExperienceCloud',
    title: 'Order enrichment admin',
    shortTitle: 'OEA',
  };
  runtime.title = 'Order enrichment admin';
}
