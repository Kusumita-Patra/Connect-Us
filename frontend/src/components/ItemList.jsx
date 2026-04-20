import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

function ItemList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      setLoading(true);
      setError("");

      try {
        const snap = await getDocs(query(collection(db, "items")));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load items.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItems();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => (item?.name || "").toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Items</h1>
        <div style={styles.searchRow}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            style={styles.searchInput}
            aria-label="Search items by name"
          />
          <Link to="/upload" style={styles.primaryLink}>
            Sell Item
          </Link>
        </div>
      </div>

      {loading ? <p style={styles.status}>Loading items…</p> : null}
      {error ? (
        <p style={{ ...styles.status, color: "#b91c1c" }}>{error}</p>
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        <p style={styles.status}>No items found.</p>
      ) : null}

      <div style={styles.grid}>
        {filtered.map((item) => (
          <div key={item.id} style={styles.card}>
            {item?.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item?.name || "Item image"}
                style={styles.image}
                loading="lazy"
              />
            ) : (
              <div style={styles.imageFallback} />
            )}

            <div style={styles.cardBody}>
              <div style={styles.cardTop}>
                <h3 style={styles.cardTitle}>{item?.name || "Untitled item"}</h3>
                {item?.price ? (
                  <div style={styles.price}>₹{item.price}</div>
                ) : null}
              </div>

              <p style={styles.desc}>
                {item?.description || "No description provided."}
              </p>

              <div style={styles.cardActions}>
                <Link to={`/item/${item.id}`} style={styles.secondaryLink}>
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "24px",
  },
  header: {
    maxWidth: 980,
    margin: "0 auto 18px auto",
  },
  title: {
    margin: 0,
    fontSize: 34,
    letterSpacing: 0.2,
    color: "#111827",
  },
  searchRow: {
    marginTop: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: "1 1 360px",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
    background: "#fff",
  },
  primaryLink: {
    textDecoration: "none",
    background: "#4f46e5",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
  },
  status: {
    maxWidth: 980,
    margin: "12px auto",
    color: "#374151",
  },
  grid: {
    maxWidth: 980,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
    border: "1px solid #eef0f5",
    boxShadow: "0 6px 20px rgba(17,24,39,0.06)",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    background: "#f3f4f6",
  },
  imageFallback: {
    width: "100%",
    height: 150,
    background:
      "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(17,24,39,0.05))",
  },
  cardBody: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },
  cardTitle: {
    margin: 0,
    fontSize: 16,
    color: "#111827",
    lineHeight: 1.2,
  },
  price: {
    fontWeight: 700,
    color: "#059669",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  desc: {
    margin: 0,
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 1.35,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  secondaryLink: {
    textDecoration: "none",
    color: "#4f46e5",
    fontWeight: 700,
    fontSize: 13,
  },
};

export default ItemList;
