// admin/src/pages/Edit/Edit.jsx
import React, { useState, useEffect } from 'react'
import './Edit.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const Edit = ({url}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "Salad"
  });

  useEffect(() => {
    const fetchFoodItem = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await axios.get(`${url}/api/food/${id}`, {
          headers: { token }
        });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching food item:", error);
        toast.error("Error fetching food item");
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.reload();
        }
      }
    };
    fetchFoodItem();
  }, [id, url]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (data.offerPrice && Number(data.offerPrice) >= Number(data.price)) {
      toast.error("Offer price must be less than regular price");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    if (data.offerPrice) {
      formData.append("offerPrice", Number(data.offerPrice));
    }
    formData.append("category", data.category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(`${url}/api/food/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating food:", error);
      toast.error("Error updating food item");
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    }
  }

  const handleCancel = () => {
    navigate('/list');
  }

  return (
    <div className='edit'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="edit-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img 
              src={
                image ? URL.createObjectURL(image) : 
                data.image ? `${url}/images/${data.image}` : 
                assets.upload_area
              } 
              alt="" 
            />
          </label>
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id='image' 
            hidden 
          />
        </div>
        <div className="edit-product-name flex-col">
          <p>Product name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Type here' 
            required
          />
        </div>
        <div className="edit-product-description flex-col">
          <p>Product description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows="6" 
            placeholder='Write content here' 
            required
          ></textarea>
        </div>
        <div className="edit-category-price">
          <div className="edit-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Momos">Momos</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>
          <div className="edit-price-container">
            <div className="edit-price flex-col">
                <p>Product price</p>
                <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='₹200' required />
            </div>
            <div className="edit-price flex-col">
                <p>Offer price</p>
                <input onChange={onChangeHandler} value={data.offerPrice} type="Number" name='offerPrice' placeholder='₹150' />
            </div>
          </div>
        </div>
        <div className="edit-buttons">
          <button type='button' className='edit-cancel-btn' onClick={handleCancel}>
            CANCEL
          </button>
          <button type='submit' className='edit-save-btn'>
            SAVE CHANGES
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit