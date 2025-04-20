// // src/components/Navbar/Navbar.jsx
// import React, { useContext, useState, useEffect } from 'react'
// import './Navbar.css'
// import { assets } from '../../assets/assets'
// import { Link, useNavigate } from 'react-router-dom'
// import { StoreContext } from '../../context/StoreContext'
// import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'

// const Navbar = ({ setShowLogin }) => {
//   const [menu, setMenu] = useState("home")
//   const { getTotalCartAmount, token, setToken, food_list, setUser  } = useContext(StoreContext)
//   const [showProfile, setShowProfile] = useState(false)
//   const [showSearch, setShowSearch] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const navigate = useNavigate()

//   const logout = () => { 
//     localStorage.removeItem("token");
//     setToken("");
//     setUser(null);
//     navigate("/");
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
//       setShowSearch(false)
//       setSearchQuery("")
//     }
//   }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.navbar-profile')) {
//         setShowProfile(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className='navbar'>
//       <Link to='/'><img src={assets.logo_1} alt="" className='logo' /></Link>
//       <ul className="navbar-menu">
//         <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
//         <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
//         <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
//         <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
//       </ul>
//       <div className="navbar-right">
//         {showSearch && (
//           <form onSubmit={handleSearch} className="navbar-search-form">
//             <input
//               type="text"
//               placeholder="Search food items..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               autoFocus
//             />
//             <button type="submit">
//               <img src={assets.search_icon} alt="Search" />
//             </button>
//           </form>
//         )}
//         {!showSearch && (
//           <img 
//             src={assets.search_icon} 
//             alt="Search" 
//             onClick={() => setShowSearch(true)} 
//             className="search-icon"
//           />
//         )}
//         <div className="navbar-search-icon">
//           <Link to='/cart'><img src={assets.cart} alt="" /></Link>
//           <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
//         </div>
//         {!token ? <button onClick={() => setShowLogin(true)}>Sign in</button>
//           : <div className='navbar-profile'>
//             <img src={assets.profile_icon} alt="" onClick={() => setShowProfile(!showProfile)} />
//             {showProfile && <ProfileDropdown setShowProfile={setShowProfile} />}
//             <ul className='nav-profile-dropdown'>
//               <li className="dropdown-header">
//                 <img src={assets.profile_icon} alt="" />
//                 <span>My Account</span>
//               </li>
//               <hr />
//               <li onClick={() => navigate('/profile')}>
//                 <img src={assets.user} alt="" />
//                 <p>Profile</p>
//               </li>
//               <hr />
//               <li onClick={() => navigate('/myorders')}>
//                 <img src={assets.bag_icon} alt="" />
//                 <p>My Orders</p>
//               </li>
//               <hr />
//               <li onClick={logout} className="logout-item">
//                 <img src={assets.logout_icon} alt="" />
//                 <p>Logout</p>
//               </li>
//             </ul>
//           </div>}
//       </div>
//     </div>
//   )
// }

// export default Navbar


// src/components/Navbar/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home")
  const { getTotalCartAmount, token, setToken, food_list, setUser, cartItems } = useContext(StoreContext)
  const [showProfile, setShowProfile] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    setUser(null)
    navigate("/")
    setShowProfile(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  const getCartItemCount = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo_1} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        {showSearch && (
          <form onSubmit={handleSearch} className="navbar-search-form">
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className='search-toggle search-submit'>
              <img src={assets.search_icon} alt="Search" />
            </button>
          </form>
        )}
        {!showSearch && (
          <img
            src={assets.search_icon}
            alt="Search"
            onClick={() => setShowSearch(true)}
            className="search-icon"
          />
        )}


        <div className="navbar-cart-icon">
          {/* <Link to='/cart'><img src={assets.cart} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div> */}
          <Link to='/cart'>
              <img src={assets.cart} alt="Cart" />
              {getCartItemCount() > 0 && (
                <div className="cart-item-count">
                  {getCartItemCount()}
                </div>
              )}
          </Link>
        </div>
        {!token ? <button className='sign-in' onClick={() => setShowLogin(true)}>Sign in</button>
          : <div className='navbar-profile' ref={dropdownRef}>
            <img 
              src={assets.profile_icon} 
              alt="" 
              onClick={() => setShowProfile(!showProfile)} 
              className={`profile-icon ${showProfile ? 'active' : ''}`}
            />
            {showProfile && (
              <ul className='nav-profile-dropdown'>
                <li onClick={() => {
                  navigate('/profile')
                  setShowProfile(false)
                }}>
                  <img src={assets.user} alt="" />
                  <p>Profile</p>
                </li>
                <li onClick={() => {
                  navigate('/myorders')
                  setShowProfile(false)
                }}>
                  <img src={assets.bag_icon} alt="" />
                  <p>My Orders</p>
                </li>
                <li onClick={logout} className="logout-item">
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>}
      </div>
    </div>
  )
}

export default Navbar