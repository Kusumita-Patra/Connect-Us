import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,             // Added missing import
  serverTimestamp,    // Added missing import
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import "./ItemDetail.css";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [sellerFeedback, setSellerFeedback] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [showFullImage, setShowFullImage] = useState(false);

  // REDIRECT TO INTERMEDIARY CONTACT SELLER PROFILE VIEW
  const handleContactSellerRedirect = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.uid === item.sellerId) {
      alert("This is your own listed item.");
      return;
    }

    navigate(`/contact-seller/${id}`);
  };

  // ADD REVIEW
  const submitReview = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const newReview = {
        rating,
        review,
        sellerFeedback,
        reviewerId: currentUser.uid,
        reviewerName: currentUsername || "Anonymous",
        createdAt: new Date(),
      };

      const docRef = await addDoc(
        collection(db, "items", item.id, "reviews"),
        newReview
      );

      setReviews([
        {
          id: docRef.id,
          ...newReview,
        },
        ...reviews,
      ]);

      alert("Review added!");
      setReview("");
      setSellerFeedback("");
      setRating(0);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE REVIEW
  const deleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "items", item.id, "reviews", reviewId));
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error(error);
    }
  };

  // FETCH ITEM
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({
            id: docSnap.id,
            ...docSnap.data(),
          });

          // FETCH REVIEWS
          const reviewsRef = collection(db, "items", id, "reviews");
          const reviewSnap = await getDocs(reviewsRef);
          const reviewList = reviewSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(reviewList);

          // SAFE FETCH USERNAME
          const currentUser = auth.currentUser;
          if (currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              setCurrentUsername(userSnap.data().username);
            }
          }
        } else {
          console.log("No such item!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchItem();
  }, [id]);

  // ADD TO CART (Now Fully Operational)
  const handleAddToCart = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      if (item.status === "Sold Out") {
        alert("Sorry, this item is sold out and cannot be added to cart.");
        return;
      }

      if (currentUser.uid === item.sellerId) {
        alert("You cannot purchase your own listed item.");
        return;
      }

      const cartRef = doc(db, "users", currentUser.uid, "cart", item.id);

      await setDoc(cartRef, {
        itemId: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
        sellerId: item.sellerId,
        createdAt: serverTimestamp(),
      });

      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Cart insertion error details:", error);
      alert("Failed to add item to cart. Check console log.");
    }
  };

  if (!item) return <h2>Loading...</h2>;

  return (
    <div className="itemDetailContainer">
      <div className="itemCard">
        {/* IMAGE */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="itemImage"
          onClick={() => setShowFullImage(true)}
        />

        {/* DETAILS */}
        <div className="itemDetails">
          <div className="itemTitle">{item.name}</div>
          <div className="itemPrice">₹{item.price}</div>
          <div className={item.status === "Sold Out" ? "soldStatus" : "stockStatus"}>
            {item.status}
          </div>
          <div className="itemCategory">Category: {item.category}</div>
          <div className="itemDesc">{item.description}</div>

          {/* ACTION BUTTONS */}
          <div className="actionButtons">
            <button className="buyBtn" onClick={handleContactSellerRedirect}>
              Contact Seller
            </button>

            <button
              className="contactBtn"
              onClick={handleAddToCart}
              disabled={
                item.status === "Sold Out" ||
                auth.currentUser?.uid === item.sellerId
              }
            >
              {auth.currentUser?.uid === item.sellerId
                ? "Your Item"
                : item.status === "Sold Out"
                ? "Sold Out"
                : "Add to Cart"}
            </button>
          </div>

          {/* REVIEW SECTION */}
          <div className="reviewSection">
            <h3>Rate this Item</h3>
            <div className="starRating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? "star activeStar" : "star"}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <textarea
              placeholder="Feedback on seller..."
              value={sellerFeedback}
              onChange={(e) => setSellerFeedback(e.target.value)}
            />
            <button onClick={submitReview}>Submit Review</button>
          </div>

          {/* ALL REVIEWS */}
          <div className="allReviews">
            <h3>Reviews</h3>
            {reviews.map((r) => (
              <div key={r.id} className="reviewCard">
                <strong>{r.reviewerName}</strong>
                <div className="reviewRating">⭐ {r.rating}/5</div>
                <p className="reviewText">{r.review}</p>
                {r.sellerFeedback && (
                  <div className="sellerFeedback">
                    <strong>Feedback on Seller:</strong>
                    <p>{r.sellerFeedback}</p>
                  </div>
                )}
                {r.reviewerId === auth.currentUser?.uid && (
                  <button
                    className="deleteReviewBtn"
                    onClick={() => deleteReview(r.id)}
                  >
                    Delete Review
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULL SCREEN IMAGE VIEW */}
      {showFullImage && (
        <div className="fullscreenOverlay">
          <button
            className="closePreviewBtn"
            onClick={() => setShowFullImage(false)}
          >
            ✕ Close
          </button>
          <img src={item.imageUrl} alt={item.name} className="fullscreenImage" />
        </div>
      )}
    </div>
  );
}

export default ItemDetail;