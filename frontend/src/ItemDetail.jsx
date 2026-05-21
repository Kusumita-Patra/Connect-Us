import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  db,
  auth,
} from "./firebase";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import "./ItemDetail.css";

function ItemDetail() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [item, setItem] = useState(null);

  const [rating, setRating] = useState(0);

  const [review, setReview] = useState("");

  const [sellerFeedback, setSellerFeedback] = useState("");

  const [reviews, setReviews] = useState([]);

  const [currentUsername, setCurrentUsername] = useState("");

  const handleChat = async () => {
    try {
      console.log("BUTTON CLICKED");

      const buyerId = auth.currentUser.uid;

      console.log("buyerId:", buyerId);

      console.log("item:", item);

      const sellerId = item.sellerId;
      if (buyerId === sellerId) {
        alert("You cannot chat with yourself");

        return;
      }

      console.log("sellerId:", sellerId);

      const itemId = id;

      const chatId =
        buyerId < sellerId
          ? `${buyerId}_${sellerId}_${itemId}`
          : `${sellerId}_${buyerId}_${itemId}`;

      console.log("chatId:", chatId);

      const chatRef = doc(db, "chats", chatId);

      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        console.log("Creating chat");

        await setDoc(chatRef, {
          buyerId,
          sellerId,
          itemId,

          participants: [buyerId, sellerId],

          createdAt: serverTimestamp(),

          lastMessage: "",
        });
      }

      console.log("Navigating");

      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error(error);
    }
  };
  const [item, setItem] =
    useState(null);

  const submitReview = async () => {
    try {
      await addDoc(
        collection(db, "items", item.id, "reviews"),

        {
          rating,

          review,

          sellerFeedback,

          reviewerId: auth.currentUser.uid,

          reviewerName: currentUsername,

          createdAt: new Date(),
        },
      );

      alert("Review added!");

      setReview("");

      setSellerFeedback("");

      setRating(5);
    } catch (error) {
      console.error(error);
    }
  };

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

    const fetchItem =
      async () => {

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

          // FETCH CURRENT USERNAME

          const userRef = doc(db, "users", auth.currentUser.uid);

          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setCurrentUsername(userSnap.data().username);
          }
        } else {
          console.log("No such item!");
        try {

          const docRef =
            doc(
              db,
              "items",
              id
            );

          const docSnap =
            await getDoc(
              docRef
            );

          if (
            docSnap.exists()
          ) {

            setItem({
              id: docSnap.id,
              ...docSnap.data(),
            });

          } else {

            console.log(
              "No such item!"
            );
          }

        } catch (error) {

          console.error(error);
        }
      };

    fetchItem();

  }, [id]);

  // ADD TO CART

  const handleAddToCart =
    async () => {

      try {

        const currentUser =
          auth.currentUser;

        if (!currentUser) {

          navigate("/login");

          return;
        }

        const cartRef = doc(
          db,
          "users",
          currentUser.uid,
          "cart",
          item.id
        );

        await setDoc(cartRef, {

          itemId: item.id,

          name: item.name,

          price: item.price,

          imageUrl:
            item.imageUrl,

          category:
            item.category,

          sellerId:
            item.sellerId,

          createdAt:
            serverTimestamp(),
        });

        alert(
          "Added to cart"
        );

      } catch (error) {

        console.error(error);
      }
    };

  // LOADING

  if (!item)
    return <h2>Loading...</h2>;

  return (

    <div className="itemDetailContainer">

      <div className="itemCard">

        {/* IMAGE */}

        <img
          src={item.imageUrl}
          alt={item.name}
          className="itemImage"
        />

        {/* DETAILS */}

        <div className="itemDetails">

          <div className="itemTitle">

            {item.name}

          </div>

          <div className="itemPrice">

            ₹{item.price}

          </div>

          <div
            className={
              item.status ===
              "Sold Out"
                ? "soldStatus"
                : "stockStatus"
            }
          >

            {item.status}

          </div>

          <div className="itemCategory">

            Category:
            {" "}
            {item.category}

          </div>

          <div className="itemDesc">

            {item.description}

          </div>

          {/* BUTTONS */}

          <div className="actionButtons">

            <button
              className="buyBtn"
              onClick={() =>
                navigate(
                  `/contact/${id}`
                )
              }
            >

              Contact Seller

            </button>

            <button className="contactBtn">Add to Cart</button>
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
  placeholder=
    "Feedback about seller..."
  value={sellerFeedback}
  onChange={(e) =>
    setSellerFeedback(
      e.target.value
    )
  }
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

    <strong>
      Feedback on Seller:
    </strong>

    <p>
      {r.sellerFeedback}
    </p>

  </div>

)}

                {/* SHOW ONLY FOR OWNER */}

                {r.reviewerId === auth.currentUser.uid && (
                  <button
                    className="deleteReviewBtn"
                    onClick={() => deleteReview(r.id)}
                  >
                    Delete Review
                  </button>
                )}
              </div>
            ))}
            <button
              className="contactBtn"
              onClick={
                handleAddToCart
              }
            >

              Add to Cart

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ItemDetail;