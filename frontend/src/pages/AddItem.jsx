import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import { useNavigate } from "react-router-dom";

import "./AddItem.css";

const AddItem = () => {

  const navigate = useNavigate();

  // ITEM DATA

  const [item, setItem] = useState({

    name: "",

    description: "",

    price: "",

    category: "",

  });

  // SELLER DATA

  const [sellerData, setSellerData] =
    useState(null);

  // IMAGE

  const [image, setImage] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // FETCH CURRENT USER DATA

  useEffect(() => {

    const fetchSellerData = async () => {

      try {

        const currentUser =
          auth.currentUser;

        if (!currentUser) return;

        const userRef = doc(
          db,
          "users",
          currentUser.uid
        );

        const userSnap =
          await getDoc(userRef);

        if (userSnap.exists()) {

          setSellerData(
            userSnap.data()
          );

        } else {

          console.log(
            "Seller data not found"
          );

        }

      } catch (error) {

        console.error(error);

      }
    };

    fetchSellerData();

  }, []);

  // HANDLE INPUTS

  const handleChange = (e) => {

    setItem({
      ...item,
      [e.target.name]:
        e.target.value,
    });
  };

  // HANDLE IMAGE

  const handleImageChange = (e) => {

    setImage(e.target.files[0]);

  };

  // HANDLE SUBMIT

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (!sellerData) {

        alert("Seller data not found");

        return;

      }

      // CLOUDINARY UPLOAD

      const formData = new FormData();

      formData.append("file", image);

      formData.append(
        "upload_preset",
        "unsigned_upload"
      );

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfnritd9w/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );


      const data = await res.json();
      // SEND IMAGE TO AI BACKEND

      const aiFormData = new FormData();

      aiFormData.append("file", image);

      const aiResponse = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: aiFormData,
        }
      );

      const aiData = await aiResponse.json();
      let suggestedCategory = item.category;

      if (aiData.detections.length > 0) {

        const detectedClass =
          aiData.detections[0].class;

        if (
          ["laptop", "keyboard", "mouse", "cell phone"]
            .includes(detectedClass)
        ) {

          suggestedCategory = "Electronics";

        }

        else if (
          ["book"].includes(detectedClass)
        ) {

          suggestedCategory = "Books";

        }
      }

      console.log("AI Detection:", aiData);

      setAiAnalysis(aiData);

      // SAVE ITEM

      await addDoc(
        collection(db, "items"),
        {

          ...item,
          category: suggestedCategory,

          imageUrl:
            data.secure_url,

          aiDetections:
            aiData.detections,

          createdAt:
            new Date(),

          status:
            "In Stock",

          // SELLER INFO

          sellerId:
            auth.currentUser.uid,

          sellerName:
            sellerData.username,

          sellerPhone:
            sellerData.mobileNumber,

          sellerEmail:
            sellerData.email,

          sellerLocation:
            sellerData.location,

        }
      );

      alert(
        "Item uploaded successfully!"
      );

      // RESET

      setItem({

        name: "",

        description: "",

        price: "",

        category: "",

      });

      setImage(null);

      // REDIRECT

      navigate("/");

    } catch (error) {

      console.error(error);

      alert(error.message);

    }
  };

  return (

    <div className="addItemPage">

      <div className="addItemCard">

        <h2>Add New Item</h2>

        <form
          className="addItemForm"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={item.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={item.description}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={item.price}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={item.category}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Category
            </option>

            <option value="Books">
              Books
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Stationery">
              Stationery
            </option>

          </select>

          {/* IMAGE */}

          <input
            type="file"
            onChange={
              handleImageChange
            }
            required
          />

          {image && (

            <div className="imagePreview">

              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                width="120"
              />

            </div>

          )}
          {aiAnalysis && (
            <div>

              <h4>AI Detection</h4>

              {aiAnalysis.detections.map(
                (item, index) => (
                  <p key={index}>
                    {item.class} (
                    {(item.confidence * 100).toFixed(1)}
                    %)
                  </p>
                )
              )}

            </div>
          )}

          <button
            type="submit"
            className="uploadBtn"
          >

            Upload Item

          </button>

        </form>

      </div>

    </div>
  );
};

export default AddItem;