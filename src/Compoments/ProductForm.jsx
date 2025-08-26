import React, { useState } from "react";

import "../pages/Products/ProductList.css"
import {ProductService} from "../services/productService.js";

function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageChange = (files) => {
    const fileArray = Array.from(files);
    setImages(fileArray);
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleFileInputChange = (e) => {
    handleImageChange(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleImageChange(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Vui lòng chọn ít nhất một hình ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    images.forEach((image) => formData.append("imageUrl", image));

    try {
      await ProductService.create(formData);
      alert("Tạo sản phẩm thành công!");
      window.location.reload();
    } catch (err) {
      console.error("Tạo sản phẩm thất bại:", err);
      alert("Đã có lỗi xảy ra.");
    }
  };

  const handleCancel = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImages([]);
    setPreviewUrls([]);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Tạo Sản Phẩm</h2>
      <div>
        <label>Tên sản phẩm:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Giá sản phẩm:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          required
        />
      </div>

      <div>
        <label>Mô tả:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div
        className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        Kéo & thả ảnh vào đây hoặc click để chọn ảnh
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          id="fileInput"
        />
      </div>

      <div className="preview-container">
        {previewUrls.map((url, index) => (
          <img key={index} src={url} alt={`preview-${index}`} />
        ))}
      </div>

      <div className="button-group">
        <button type="submit">Tạo sản phẩm</button>
        <button type="button" onClick={handleCancel}>Hủy</button>
      </div>
    </form>
  );
}

export default ProductForm;
