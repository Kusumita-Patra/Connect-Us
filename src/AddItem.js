import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const AddItem = () => {
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  // Handle input change
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Clicked"); 

    try {
      await addDoc(collection(db, "items"), {
        ...item,
        createdAt: new Date()
      });

      alert("Item uploaded successfully!");

      // Reset form
      setItem({
        name: "",
        description: "",
        price: "",
        category: ""
      });

    } catch (error) {
  console.error("Error:", error);
  alert("Error: " + error.message);
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

        <button type="submit">Upload Item</button>
      </form>
    </div>
  );
};

export default AddItem;