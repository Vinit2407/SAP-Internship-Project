import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth()

  // Hide sidebar only on edit page path
  if (!isAuthenticated || location.pathname.includes('/edit')) return null;

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className={({isActive}) => 
          `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.add_icon} alt="Add Items" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className={({isActive}) => 
          `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.order_icon} alt="List Items" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className={({isActive}) => 
          `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar