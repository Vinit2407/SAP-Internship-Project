import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id, name, price, description, image, offerPrice}) => {

    const {cartItems, addToCart, removeFromCart, url, token } = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!token) {
          // Handle case where user isn't logged in
          alert("Please login to add items to cart");
          return;
        }
    
        setIsLoading(true);
        try {
          await addToCart(id);
        } catch (error) {
          console.error("Add to cart error:", error);
          alert("Failed to add item to cart");
        } finally {
          setIsLoading(false);
        }
      };
    
    
      const handleRemoveFromCart = async () => {
        setIsLoading(true);
        try {
          await removeFromCart(id);
        } catch (error) {
          console.error("Remove from cart error:", error);
          alert("Failed to remove item from cart");
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div className='food-item'>
        <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt="" />
        {!cartItems[id] ? (
          <img 
            className='add' 
            // onClick={() => addToCart(id)} 
            onClick={handleAddToCart} 
            src={assets.add_icon_white} 
            alt=""
            disabled={isLoading} 
          />
        ) : (
          <div className='food-item-counter'>
            <img 
            //   onClick={() => removeFromCart(id)} 
              onClick={handleRemoveFromCart}
              src={assets.remove_icon_red} 
              alt=""
              disabled={isLoading}
            />
            <p>{cartItems[id]}</p>
            <img 
            //   onClick={() => addToCart(id)} 
              onClick={handleAddToCart} 
              src={assets.add_icon_green} 
              alt=""
              disabled={isLoading}
            />
          </div>
          )}
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className="food-item-description">{description}</p>
            <div className="food-item-price-container">
                {offerPrice ? (
                    <>
                        <span className="food-item-offer-price">₹{offerPrice}</span>
                        <span className="food-item-original-price">₹{price}</span>
                    </>
                ) : (
                    <span className="food-item-price">₹{price}</span>
                )}
            </div>
        </div>
    </div>
  )
}

export default FoodItem