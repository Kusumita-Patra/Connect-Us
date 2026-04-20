import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchItem() {
      setLoading(true);
      setError("");

      try {
        const snap = await getDoc(doc(db, "items", id));
        if (!snap.exists()) {
          if (!cancelled) setError("Item not found.");
          return;
        }
        if (!cancelled) setItem({ id: snap.id, ...snap.data() });
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load item.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItem();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topBar}>
          <Link to="/" style={styles.backLink}>
            ← Back
          </Link>
        </div>

        {loading ? <p style={styles.status}>Loading item…</p> : null}
        {error ? (
          <p style={{ ...styles.status, color: "#b91c1c" }}>{error}</p>
        ) : null}

        {!loading && !error && item ? (
          <div style={styles.card}>
            <div style={styles.media}>
              {item?.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item?.name || "Item image"}
                  style={styles.image}
                />
              ) : (
                <div style={styles.imageFallback} />
              )}
            </div>

            <div style={styles.body}>
              <h2 style={styles.title}>{item?.name || "Untitled item"}</h2>
              {item?.price ? <div style={styles.price}>₹{item.price}</div> : null}
              {item?.category ? (
                <div style={styles.meta}>Category: {item.category}</div>
              ) : null}

              <p style={styles.desc}>
                {item?.description || "No description provided."}
              </p>

              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.contactBtn}
                  onClick={() => alert("Contact Seller (placeholder)")}
                >
                  Contact Seller
                </button>
                <Link to="/" style={styles.secondaryBtn}>
                  Browse more
                </Link>
              </div>
            </div>
          </div>
        ) : null}
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
  shell: {
    maxWidth: 980,
    margin: "0 auto",
  },
  topBar: {
    marginBottom: 12,
  },
  backLink: {
    textDecoration: "none",
    color: "#4f46e5",
    fontWeight: 700,
  },
  status: {
    color: "#374151",
    margin: "12px 0",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #eef0f5",
    boxShadow: "0 10px 28px rgba(17,24,39,0.08)",
    display: "grid",
    gridTemplateColumns: "1fr",
  },
  media: {
    background: "#f3f4f6",
  },
  image: {
    width: "100%",
    height: 340,
    objectFit: "cover",
    display: "block",
  },
  imageFallback: {
    width: "100%",
    height: 340,
    background:
      "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(17,24,39,0.05))",
  },
  body: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    margin: 0,
    fontSize: 26,
    color: "#111827",
  },
  price: {
    fontWeight: 800,
    color: "#059669",
    fontSize: 18,
  },
  meta: {
    color: "#6b7280",
    fontSize: 13,
  },
  desc: {
    margin: "6px 0 0 0",
    color: "#374151",
    lineHeight: 1.5,
  },
  actions: {
    marginTop: 8,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  contactBtn: {
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryBtn: {
    textDecoration: "none",
    borderRadius: 12,
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    color: "#111827",
    fontWeight: 800,
    background: "#fff",
  },
};

export default ItemDetail;
