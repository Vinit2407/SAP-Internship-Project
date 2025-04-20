import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({url}) => {
  const [image,setImage] = useState(false);
  const [data,setData] = useState({
    name:"",
    description:"",
    price:"",
    offerPrice: "", 
    category:"Salad"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data,[name]:value}))
  }

  const onSubmitHandler = async(event) => {
    event.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (data.offerPrice && Number(data.offerPrice) >= Number(data.price)) {
      toast.error("Offer price must be less than regular price");
      return;
    }

    const formData = new FormData();

    formData.append("name",data.name);
    formData.append("description",data.description);
    formData.append("price",Number(data.price));
    // formData.append("offerPrice", data.offerPrice ? Number(data.offerPrice) : "");
    if (data.offerPrice) {
      formData.append("offerPrice", Number(data.offerPrice));
    }
    formData.append("category",data.category);
    formData.append("image",image);

    try {
      const response = await axios.post(`${url}/api/admin/add-food`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token
        }
      });

      if (response.data.success) {
        // Reset form
        setData({
          name:"",
          description:"",
          price:"",
          offerPrice: "",
          category:"Salad"
        })
        setImage(false)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Error adding food item");
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
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
          <div className="add-price-container">
            <div className="add-price flex-col">
              <p>Product price</p>
              <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='₹200' required />
            </div>
            <div className="add-price flex-col">
              <p>Offer price</p>
              <input onChange={onChangeHandler} value={data.offerPrice} type="Number" name='offerPrice' placeholder='₹150' />
            </div>
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  )
}

export default Add