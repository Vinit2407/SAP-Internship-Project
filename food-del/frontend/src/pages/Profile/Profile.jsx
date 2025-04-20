import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const Profile = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // const fetchProfile = async () => {
    //     try {
    //       const response = await axios.post(url + "/api/user/profile", {}, {
    //         headers: { token }
    //       });
          
    //       if (response.data.success && response.data.profile) {
    //         const profile = response.data.profile;
    //         setData({
    //           firstName: profile.firstName || "",
    //           lastName: profile.lastName || "",
    //           email: response.data.email || "", // Make sure backend sends email in response
    //           phone: profile.phone || "",
    //           street: profile.address?.street || "",
    //           city: profile.address?.city || "",
    //           state: profile.address?.state || "",
    //           zipcode: profile.address?.zipcode || "",
    //           country: profile.address?.country || ""
    //         });
    //       }
    //     } catch (error) {
    //       console.error("Error fetching profile:", error);
    //       toast.error("Error loading profile data");
    //     }
    //   };

    const fetchProfile = async () => {
        try {
          const response = await axios.get(`${url}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            const { profile, email } = response.data;
            setData({
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              email: email || "",
              phone: profile.phone || "",
              street: profile.address?.street || "",
              city: profile.address?.city || "",
              state: profile.address?.state || "",
              zipcode: profile.address?.zipcode || "",
              country: profile.address?.country || ""
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile data");
        }
      };


    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.put(`${url}/api/user/profile`, {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            street: data.street,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            country: data.country
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
    
          if (response.data.success) {
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            await fetchProfile(); // Refresh data
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          toast.error(error.response?.data?.message || "Failed to update profile");
        }
      };

    //   useEffect(() => {
    //     if (!token) {
    //       navigate('/');
    //     } else {
    //       fetchProfile();
    //     }
    //   }, [token]); 


    // useEffect(() => {
    //     const loadProfile = async () => {
    //       try {
    //         if (token) {
    //           await fetchProfile();
    //         } else {
    //           navigate('/');
    //         }
    //       } catch (error) {
    //         console.error("Profile load error:", error);
    //         toast.error("Failed to load profile");
    //       }
    //     };
        
    //     loadProfile();
    //   }, [token, navigate]);

    useEffect(() => {
        if (!token) {
          navigate('/');
        } else {
          fetchProfile();
        }
      }, [token, navigate]);

    return (
        <div className='profile-page'>
            <div className="profile-header"> 
                <button className="profile-back-button" onClick={() => navigate('/')}>
                <img src={assets.back_icon} alt="Back" />
                </button>
                <h2>My Profile</h2>
            </div>
            {!isEditing ? (
                <div className="profile-view">
                    <div className="profile-info">
                        <h3>Personal Information</h3>
                        <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
                        <p><strong>Phone:</strong> {data.phone}</p>
                    </div>
                    
                    <div className="profile-info">
                        <h3>Address</h3>
                        <p><strong>Street:</strong> {data.street}</p>
                        <p><strong>City:</strong> {data.city}</p>
                        <p><strong>State:</strong> {data.state}</p>
                        <p><strong>Zip Code:</strong> {data.zipcode}</p>
                        <p><strong>Country:</strong> {data.country}</p>
                    </div>
                    
                    <button className='Edit' onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={onSubmitHandler} className="profile-edit">
                    <div className="form-group">
                        <label>First Name</label>
                        <input name='firstName' value={data.firstName} onChange={onChangeHandler} type="text" required />
                    </div>
                    
                    <div className="form-group">
                        <label>Last Name</label>
                        <input name='lastName' value={data.lastName} onChange={onChangeHandler} type="text" required />
                    </div>
                    
                    <div className="form-group">
                        <label>Phone</label>
                        <input name='phone' value={data.phone} onChange={onChangeHandler} type="tel" required />
                    </div>
                    
                    <div className="form-group">
                        <label>Street</label>
                        <input name='street' value={data.street} onChange={onChangeHandler} type="text" required />
                    </div>
                    
                    <div className="form-group">
                        <label>City</label>
                        <input name='city' value={data.city} onChange={onChangeHandler} type="text" required />
                    </div>
                    
                    <div className="form-group">
                        <label>State</label>
                        <input name='state' value={data.state} onChange={onChangeHandler} type="text" required />
                    </div>
                    
                    <div className="form-group">
                        <label>Zip Code</label>
                        <input name='zipcode' value={data.zipcode} onChange={onChangeHandler} type="text" required />
                    </div>
                    
                    <div className="form-group">
                        <label>Country</label>
                        <input name='country' value={data.country} onChange={onChangeHandler} type="text" required />
                    </div>
                    
                    <div className="form-actions">
                        <button className='Edit' type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;