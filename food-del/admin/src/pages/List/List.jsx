import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { assets } from '../../assets/assets'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';

const List = ({url}) => {
  const [list,setList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchList = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.get(`${url}/api/admin/list-food`, {
        headers: { 
          token,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Error fetching food list");
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async(foodId) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.post(`${url}/api/admin/remove-food`, {id: foodId}, {
        headers: { token }
      });
      if (response.data.success) {
        await fetchList();
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      console.error("Error removing food item:", error);
      toast.error("Error removing food item");
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Offer Price</b>
          <b>Edit</b>
          <b>Remove</b>
        </div>
        {list.map((item,index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p>{item.offerPrice ? `₹${item.offerPrice}` : '-'}</p>
              <p onClick={() => navigate(`/edit/${item._id}`)} className='cursor' id='edit'>
                <img src={assets.edit_icon} alt="" />
              </p>
              <p onClick={() => removeFood(item._id)} className='cursor' id='del'>
                <img src={assets.delete_icon} alt="" />
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List