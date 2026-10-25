import { register } from '@adobe/uix-guest';
import { useEffect } from 'react';

import { MainPage } from './MainPage';
import { extensionId } from './Constants';

/**
 * @see https://github.com/adobe/adobe-commerce-samples/tree/main/admin-ui-sdk/menu/custom-menu
 */
export default function ExtensionRegistration (props) {
  useEffect(() => {
    (async () => {
      await register({
        id: extensionId,
        methods: {},
      });
    })();
  }, []);

  return <MainPage ims={props.ims} runtime={props.runtime} />;
}