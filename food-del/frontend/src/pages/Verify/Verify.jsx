import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {

    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    // const {url} = useContext(StoreContext);
    const { url, setCartItems, clearCart  } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
      const success = searchParams.get("success");
      const orderId = searchParams.get("orderId");

      try {
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        orderId
      });

      if (response.data.success) {
        if (response.data.cartCleared) {
          clearCart(); // Clear frontend cart state
        }
        navigate('/myorders', {
          state: {
            orderSuccess: true,
            newOrderId: orderId
          },
          replace: true
        });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error("Verification error:", error);
      navigate('/', { replace: true });
    }
  };

    useEffect(()=>{
        verifyPayment();
    },[])

  return (
    <div className='verify'>
        <div className="spinner">

        </div>
    </div>
  )
}

export default Verify
