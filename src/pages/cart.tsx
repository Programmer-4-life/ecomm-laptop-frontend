import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc"
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import axios from "axios";

const Cart = () => {

  const dispatch = useDispatch()

  const { cartItems, subtotal, tax, shippingCharges, discount, total } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false)

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      return
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }))
  }

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) {
      // Remove item if quantity is 1 or less
      removeHandler(cartItem.productId);
    } else {
      dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    }
  }

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId))
  }

  useEffect(() => {

    //abort controller to cancel the request
    //token type krtay huwey agar multiple requests jayengi to pichli request ko cancel krdena hai because user type kr skta hai coupon dubara
    const { token, cancel } = axios.CancelToken.source()

    const timeOutID = setTimeout(() => {
      axios.get(`/api/v1/payment/discount?coupon=${couponCode}`, {
        cancelToken: token
      })
        .then((response) => {
          dispatch(discountApplied(response.data.discount))
          setIsValidCouponCode(true)
        })
        .catch(() => {
          // console.log(error.response.data.message)
          dispatch(discountApplied(0))
          setIsValidCouponCode(false)
        })
    }, 1000)

    return () => {
      clearTimeout(timeOutID)
      cancel()
      setIsValidCouponCode(false)
    }
  }, [couponCode])

  useEffect(() => {
    dispatch(calculatePrice())
  }, [cartItems])

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <CartItemCard
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={index}
                cartItem={item} />
            ))
          ) : (
            <h1>No Items Added</h1>
          )
        }
      </main>

      <aside>
        <p>Subtotal: Rs {subtotal}</p>
        <p>Shipping Charges: Rs {shippingCharges}</p>
        <p>Tax: Rs {tax}</p>
        <p>
          Discount: <em className="red">- Rs {discount}</em>
        </p>
        <p><b>Total: Rs {total}</b></p>

        <input placeholder="Coupon Code" type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

        {couponCode && (
          isValidCouponCode ? (
            <span className="green">
              {discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">Invalid Coupon <VscError /></span>
          )
        )}

        {
          cartItems.length > 0 && <Link to="/shipping">Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart