import React, { useContext, useEffect, useState } from 'react'
import './SearchResults.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import { assets } from '../../assets/assets'

const SearchResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { food_list } = useContext(StoreContext)
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query')
    if (query) {
      setSearchQuery(query)
      const results = food_list.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      )
      setSearchResults(results)
    } else {
      navigate('/')
    }
  }, [location.search, food_list, navigate])

  return (
    <div className='search-results'>
      <div className="search-header"> 
        <button className="search-back-button" onClick={() => navigate('/')}>
          <img src={assets.back_icon} alt="Back" />
        </button>
        <h2>Search Results for "{searchQuery}"</h2>
        <button 
          className="cart-button" 
          onClick={() => navigate('/cart')}
        >
          <img src={assets.shoppingcart} alt="Cart" />
          <span>View Cart</span>
        </button>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="search-results-list">
          {searchResults.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No results found for "{searchQuery}"</p>
          <p>Try searching for something else</p>
        </div>
      )}
    </div>
  )
}

export default SearchResults