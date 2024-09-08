import { useState } from "react"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { CartReducerInitialState } from "../types/reducer-types";
import { useSelector } from "react-redux";

// const user = { _id: "", role: "" }
interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { cartItems } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer);

  // Calculate the total number of items in the cart
  const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);


  const logoutHandler = async () => {
    try {
      await signOut(auth)
      toast.success("Sign Out Successfully")
      setIsOpen(false)
    } catch (error) {
      toast.error("Sign Out Failed")
    }
  }

  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to={"/"}>HOME</Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"} className="cart-icon">
        <FaShoppingBag />
        {totalItemsInCart > 0 && (
          <span className="cart-count">{totalItemsInCart}</span>
        )}
      </Link>

      {/* If user exist */}
      {
        user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={isOpen}>
              <div>
                {
                  user.role === "admin" && (
                    <Link onClick={() => setIsOpen(false)} to="/admin/dashboard"> Admin </Link>
                  )
                }

                <Link onClick={() => setIsOpen(false)} to="/orders">Orders</Link>
                <button>
                  <FaSignOutAlt onClick={logoutHandler} />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"}>
            <FaSignInAlt />
          </Link>
        )
      }
    </nav>
  )
}

export default Header