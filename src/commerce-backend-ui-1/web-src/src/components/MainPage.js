import React, { useEffect, useState } from 'react';
import { attach } from '@adobe/uix-guest';
import { Flex, Heading, ProgressCircle, Text, View } from '@adobe/react-spectrum';

import { extensionId } from './Constants';

/** Minimal host connection — replace with Activity 5-2 dashboard when ready. */
export function MainPage (props) {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        if (!props.ims?.token) {
          const guestConnection = await attach({ id: extensionId });
          props.ims.token = guestConnection?.sharedContext?.get('imsToken');
          props.ims.org = guestConnection?.sharedContext?.get('imsOrgId');
        }
        const org = props.ims?.org || 'Unknown';
        setMessage(`Connected to Commerce Admin (Org: ${org})`);
      } catch (error) {
        console.error('Failed to connect to host:', error);
        setMessage('Could not attach to the Commerce Admin host.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  return (
    <View padding="size-400">
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" height="size-3000">
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <>
          <Heading level={1}>Enriched Orders Dashboard</Heading>
          <Text>{message}</Text>
        </>
      )}
    </View>
  );
}