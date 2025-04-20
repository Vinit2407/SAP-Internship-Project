import React, { useState, useContext, useEffect } from 'react';
import './ProfileDropdown.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const ProfileDropdown = ({ setShowProfile }) => {
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

    const fetchProfile = async () => {
        try {
            const response = await axios.post(url + "/api/user/get-profile", {}, { headers: { token } });
            if (response.data.success && response.data.profile) {
                const profile = response.data.profile;
                setData({
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    email: "", // Will be filled from user data
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
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(url + "/api/user/update-profile", {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                street: data.street,
                city: data.city,
                state: data.state,
                zipcode: data.zipcode,
                country: data.country
            }, { headers: { token } });

            if (response.data.success) {
                alert("Profile updated successfully!");
                setShowProfile(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
    };

    return (
        <div className='profile-dropdown'>
            <form onSubmit={onSubmitHandler}>
                <div className="profile-dropdown-header">
                    <h3>My Profile</h3>
                    <button type="button" onClick={() => setShowProfile(false)}>×</button>
                </div>
                
                <div className="profile-input-group">
                    <label>First Name</label>
                    <input name='firstName' value={data.firstName} onChange={onChangeHandler} type="text" required />
                </div>
                
                <div className="profile-input-group">
                    <label>Last Name</label>
                    <input name='lastName' value={data.lastName} onChange={onChangeHandler} type="text" required />
                </div>
                
                <div className="profile-input-group">
                    <label>Phone</label>
                    <input name='phone' value={data.phone} onChange={onChangeHandler} type="tel" required />
                </div>
                
                <div className="profile-input-group">
                    <label>Street</label>
                    <input name='street' value={data.street} onChange={onChangeHandler} type="text" required />
                </div>
                
                <div className="profile-input-group">
                    <label>City</label>
                    <input name='city' value={data.city} onChange={onChangeHandler} type="text" required />
                </div>
                
                <div className="profile-input-group">
                    <label>State</label>
                    <input name='state' value={data.state} onChange={onChangeHandler} type="text" required />
                </div>
                
                <div className="profile-input-group">
                    <label>Zip Code</label>
                    <input name='zipcode' value={data.zipcode} onChange={onChangeHandler} type="text" required />
                </div>
                
                <div className="profile-input-group">
                    <label>Country</label>
                    <input name='country' value={data.country} onChange={onChangeHandler} type="text" required />
                </div>
                
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default ProfileDropdown;