import React from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { ErrorBoundary } from 'react-error-boundary';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ExtensionRegistration from './ExtensionRegistration';

function fallbackComponent ({ error }) {
  return (
    <React.Fragment>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        Something went wrong :(
      </h1>
      <pre>{error?.message}</pre>
    </React.Fragment>
  );
}

function App (props) {
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale });
  });
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path });
  });

  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <Router>
        <Provider theme={defaultTheme} colorScheme="light">
          <Routes>
            <Route
              path="/"
              element={(
                <ExtensionRegistration
                  ims={props.ims}
                  runtime={props.runtime}
                />
              )}
            />
          </Routes>
        </Provider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;