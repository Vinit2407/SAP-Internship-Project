import React, { useState } from 'react'
import './Header.css'

const Header = () => {
  const [menu, setMenu] = useState("home")
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>Indulge in a diverse menu featuring a mouthwatering selection of dishes, expertly crafted with the finest ingredients and culinary mastery. Savor every bite, delivered fresh to your doorstep!</p>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}><button>View Menu</button></a>
        {/* <button>View Menu</button> */}
      </div>
    </div>
  )
}

export default Header
