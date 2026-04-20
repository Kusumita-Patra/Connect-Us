import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";


const AddItem = () => {
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  const [image, setImage] = useState(null);

  // Handle text input
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // Handle image input
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "unsigned_upload"); // we will set this

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfnritd9w/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    // 2. Save to Firestore
    await addDoc(collection(db, "items"), {
      ...item,
      imageUrl: data.secure_url,
      createdAt: new Date()
    });

    alert("Item uploaded successfully!");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Item</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={item.description}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={item.price}
          onChange={handleChange}
          required
        />
        <br /><br />

        <select
          name="category"
          value={item.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Stationery">Stationery</option>
        </select>

        <br /><br />

        {/* Image Upload */}
        <input type="file" onChange={handleImageChange} required />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
             width="100"
          />
        )}

        <br /><br />

        <button type="submit">Upload Item</button>
      </form>
    </div>
  );
};

export default AddItem;