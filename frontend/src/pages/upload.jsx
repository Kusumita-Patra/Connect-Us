import React, { useState } from "react";

function Upload() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Item:", name, desc);

    // 🔥 later connect Firebase here
  };

  return (
    <div>
      <h2>Upload Item</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;