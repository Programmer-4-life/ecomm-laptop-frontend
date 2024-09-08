import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Skeleton } from "../components/loader"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import { addToCart } from "../redux/reducer/cartReducer"
import { CartReducerInitialState } from "../types/reducer-types"
import { CartItem } from "../types/types"
const Home = () => {

  const { data, isLoading, isError } = useLatestProductsQuery("")
  const dispatch = useDispatch()

  const { cartItems } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)

  const addToCartHandler = (cartItem: CartItem) => {

    if (cartItems.some(item => item.productId === cartItem.productId)) {
      return toast.error("Item already added to cart!");
    }

    if (cartItem.stock < 1) {
      return toast.error("Out of Stock")
    }
    else {
      dispatch(addToCart(cartItem))
      toast.success("Item added to cart!");
    }
  }

  if (isError) {
    toast.error("Cannot Fetch the Products")
  }

  return (
    <div className="home">
      <section></section>

      <h1>Latest Products
        <Link to="/search" className="findmore">More</Link>
      </h1>

      <main>
        {
          isLoading ? (
            <Skeleton width="80vw" />
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                photo={i.photo}
                handler={addToCartHandler}
              />
            )
            ))
        }
      </main>
    </div>
  )
}

export default Home