import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { NewOrderRequest } from "../types/api-types"
import { useDispatch, useSelector } from "react-redux"
import { useNewOrderMutation } from "../redux/api/orderAPI"
import { responseToast } from "../utils/features"
import { RootState } from "../redux/store"
import { resetCart } from "../redux/reducer/cartReducer"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  /* instead of writing this
  useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)

  we can use RootState in store.ts and write like below
  */
  const { user } = useSelector((state: RootState) => state.userReducer)

  const {
    cartItems,
    total,
    shippingInfo,
    subtotal,
    discount,
    tax,
    shippingCharges,
  } = useSelector((state: RootState) => state.cartReducer)

  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const [newOrder] = useNewOrderMutation()

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }
    setIsProcessing(true)

    const orderData: NewOrderRequest = {
      orderItems: cartItems,
      shippingInfo: shippingInfo,
      subtotal,
      discount,
      tax,
      shippingCharges,
      total,
      user: user?._id!,
    }

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required"
    })

    if (error) {
      setIsProcessing(false)
      return toast.error(error.message || "Something Went Wrong")
    }

    if (paymentIntent?.status === "succeeded") {
      const res = await newOrder(orderData)
      dispatch(resetCart())
      responseToast(res, navigate, "/orders")
    }
    setIsProcessing(false)
  }

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  )
}

const Checkout = () => {
  const location = useLocation()

  const clientSecret: string | undefined = location.state.clientSecret

  if (!clientSecret) {
    return <Navigate to={"/shipping"} />
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: clientSecret
      }}>
      <CheckoutForm />
    </Elements>
  )
}

export default Checkout