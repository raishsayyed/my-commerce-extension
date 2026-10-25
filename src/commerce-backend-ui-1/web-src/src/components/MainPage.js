import React, { useEffect, useState } from 'react';
import { attach } from '@adobe/uix-guest';
import { extensionId } from './Constants';
import {
  Provider,
  defaultTheme,
  View,
  Heading,
  Text,
  Flex,
  ProgressCircle,
  Well,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
} from '@adobe/react-spectrum';

// Replace <namespace> with your I/O Runtime namespace (aio app use / Developer Console).
const ACTION_URL = 'https://3967933-888beigetuna-stage.adobeioruntime.net/api/v1/web/course-labs/get-enriched-orders';

function MainPage () {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const guestConnection = await attach({ id: extensionId });
        const context = guestConnection.sharedContext;
        const imsToken = context.get('imsToken');

        const response = await fetch(ACTION_URL, {
          headers: {
            Authorization: `Bearer ${imsToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.orders || []);
        setSummary(data.summary || null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Provider theme={defaultTheme} colorScheme="light">
        <View padding="size-400">
          <Flex alignItems="center" gap="size-200">
            <ProgressCircle aria-label="Loading" isIndeterminate />
            <Text>Loading dashboard data...</Text>
          </Flex>
        </View>
      </Provider>
    );
  }

  if (error) {
    return (
      <Provider theme={defaultTheme} colorScheme="light">
        <View padding="size-400">
          <Heading level={1}>Enriched Orders Dashboard</Heading>
          <Well>
            <Text>Error loading data: {error}</Text>
          </Well>
        </View>
      </Provider>
    );
  }

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <View padding="size-400">
        <Heading level={1}>Enriched Orders Dashboard</Heading>

        {summary && (
          <Flex gap="size-300" wrap marginBottom="size-400">
            <Well minWidth="size-2400">
              <Heading level={3}>Total Orders</Heading>
              <Text UNSAFE_style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {summary.totalOrders}
              </Text>
            </Well>
            <Well minWidth="size-2400">
              <Heading level={3}>Total Revenue</Heading>
              <Text UNSAFE_style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                ${summary.totalRevenue.toFixed(2)}
              </Text>
            </Well>
            <Well minWidth="size-2400">
              <Heading level={3}>High Value Orders</Heading>
              <Text UNSAFE_style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {summary.highValueCount}
              </Text>
            </Well>
          </Flex>
        )}

        <Heading level={2}>Processed Orders</Heading>
        {orders.length === 0 ? (
          <Well>
            <Text>
              No enriched orders yet. Create orders in Commerce to generate
              event data.
            </Text>
          </Well>
        ) : (
          <TableView aria-label="Enriched orders" selectionMode="none">
            <TableHeader>
              <Column key="incrementId">Order #</Column>
              <Column key="status">Status</Column>
              <Column key="grandTotal">Total</Column>
              <Column key="tier">Tier</Column>
              <Column key="items">Items</Column>
              <Column key="processedAt">Processed</Column>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <Row key={order.orderId || order.incrementId}>
                  <Cell>{order.incrementId || order.orderId}</Cell>
                  <Cell>{order.status}</Cell>
                  <Cell>
                    {order.currency} {parseFloat(order.grandTotal).toFixed(2)}
                  </Cell>
                  <Cell>{order.enrichment?.orderTier || '—'}</Cell>
                  <Cell>{order.enrichment?.itemSummary?.length || 0}</Cell>
                  <Cell>
                    {order.processedAt
                      ? new Date(order.processedAt).toLocaleString()
                      : '—'}
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </View>
    </Provider>
  );
}

export default MainPage;
