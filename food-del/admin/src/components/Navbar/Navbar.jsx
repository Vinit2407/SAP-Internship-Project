import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className="navbar-right">
        <p>Hello <span>Admin!</span></p>
        <div className="profile-container" onClick={() => setShowDropdown(!showDropdown)}>
          <img className='profile' src={assets.profile_image} alt="" />
          {showDropdown && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar