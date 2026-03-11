import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  onImageUpload,
  isUploading,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      brand: "",
      price: "",
      weight: "",
      upload_date: "",
      description: "",
      image: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await onImageUpload(file);
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <MdClose className="text-2xl" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-green-800 font-semibold mb-2">
            Product Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-green-800 font-semibold mb-2">
            Shop
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-green-800 font-semibold mb-2">
            Price (Rs.)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500"
            step="0.01"
            required
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-green-800 font-semibold mb-2">
            Package for person
          </label>
          <select
            name="weight"
            required
            alue={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        {/* Upload Date */}
        <div>
          <label className="block text-green-800 font-semibold mb-2">
            Upload Date
          </label>
          <input
            type="date"
            value={formData.upload_date}
            onChange={(e) =>
              setFormData({ ...formData, upload_date: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-green-800 font-semibold mb-2">
            Product Image
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500"
            accept="image/*"
            disabled={isUploading}
          />
          {isUploading && (
            <p className="text-green-600 text-sm mt-2">Uploading image...</p>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover rounded-lg border border-green-100"
            />
          )}
        </div>
      </div>

      {/* Description */}
      {/* <div>
        <label className="block text-green-800 font-semibold mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500"
          rows="3"
        />
      </div> */}

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600"
          disabled={isUploading}
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
