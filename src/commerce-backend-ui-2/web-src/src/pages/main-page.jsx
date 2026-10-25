import { useEffect, useState } from "react";
import { useIms } from "@adobe/aio-commerce-lib-admin-ui/web";

const ACTION_URL =
  "https://3967933-888beigetuna-stage.adobeioruntime.net/api/v1/web/course-labs/get-enriched-orders";

function formatAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export function MainPage() {
  const { data, error: imsError } = useIms();
  const imsToken = data?.imsToken;
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (imsError || !imsToken) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    async function fetchOrders() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(ACTION_URL, {
          headers: {
            Authorization: `Bearer ${imsToken}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Could not load enriched orders (HTTP ${response.status}).`);
        }

        const result = await response.json();
        if (!Array.isArray(result.orders)) {
          throw new Error("The enriched orders service returned an invalid response.");
        }

        if (active) {
          setOrders(result.orders);
          setSummary(result.summary || null);
        }
      } catch (fetchError) {
        if (active && fetchError.name !== "AbortError") {
          setError(fetchError.message || "Could not load enriched orders.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      active = false;
      controller.abort();
    };
  }, [imsToken, imsError, refreshKey]);

  const message = imsError?.message || error;

  return (
    <main className="orders-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Enriched Orders Dashboard</h1>
          <p>Order enrichment data from your Commerce instance.</p>
        </div>
        <button
          className="refresh-button"
          disabled={loading || Boolean(imsError)}
          onClick={() => setRefreshKey((key) => key + 1)}
          type="button"
        >
          Refresh
        </button>
      </header>

      {loading ? (
        <p aria-live="polite" role="status">Loading enriched orders…</p>
      ) : message ? (
        <section aria-live="polite" className="dashboard-message dashboard-error">
          <h2>Unable to load orders</h2>
          <p>{message}</p>
        </section>
      ) : (
        <>
          {summary && (
            <section aria-label="Order summary" className="summary-cards">
              <article className="summary-card">
                <h2>Total Orders</h2>
                <p>{summary.totalOrders ?? orders.length}</p>
              </article>
              <article className="summary-card">
                <h2>Total Revenue</h2>
                <p>${formatAmount(summary.totalRevenue)}</p>
              </article>
              <article className="summary-card">
                <h2>High Value Orders</h2>
                <p>{summary.highValueCount ?? 0}</p>
              </article>
            </section>
          )}

          <section aria-labelledby="processed-orders-heading">
            <h2 id="processed-orders-heading">Processed Orders</h2>
            {orders.length === 0 ? (
              <p className="dashboard-message">
                No enriched orders yet. Create orders in Commerce to generate
                event data.
              </p>
            ) : (
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th scope="col">Order #</th>
                      <th scope="col">Status</th>
                      <th scope="col">Total</th>
                      <th scope="col">Tier</th>
                      <th scope="col">Items</th>
                      <th scope="col">Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.orderId || order.incrementId}>
                        <td>{order.incrementId || order.orderId || "—"}</td>
                        <td>{order.status || "—"}</td>
                        <td>
                          {order.currency || ""} {formatAmount(order.grandTotal)}
                        </td>
                        <td>{order.enrichment?.orderTier || "—"}</td>
                        <td>{order.enrichment?.itemSummary?.length ?? 0}</td>
                        <td>{formatDate(order.processedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
