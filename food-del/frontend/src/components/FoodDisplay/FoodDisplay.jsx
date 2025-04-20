import React, { useContext, useState, useEffect } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
  const { food_list, url } = useContext(StoreContext);
  const [sortOption, setSortOption] = useState('default');
  const [loading, setLoading] = useState(true);
  // const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    if (food_list && food_list.length > 0) {
      setLoading(false);
    }
  }, [food_list]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  if (!food_list || food_list.length === 0) {
    return <div className="no-items">No food items available</div>;
  }

  const filteredItems = category === "All" 
    ? food_list 
    : food_list.filter((item) => item.category === category)

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch(sortOption) {
      case 'price-low-high':
        return (a.offerPrice || a.price) - (b.offerPrice || b.price)
      case 'price-high-low':
        return (b.offerPrice || b.price) - (a.offerPrice || a.price)
      case 'name-a-z':
        return a.name.localeCompare(b.name)
      case 'name-z-a':
        return b.name.localeCompare(a.name)
      default:
        return 0 // default order (likely the order from the database)
    }
  })

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <h2>Top dishes near you</h2>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="default">Sort by</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-a-z">Name: A-Z</option>
            <option value="name-z-a">Name: Z-A</option>
          </select>
      </div>
      
      <div className="food-display-list">
        {sortedItems.map((item, index) => {
          return (
            <FoodItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              description={item.description} 
              price={item.price} 
              offerPrice={item.offerPrice} 
              image={item.image}
            />
          )
        })}
      </div>
    </div>
  )
}

export default FoodDisplay