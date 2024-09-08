import { FaPlus } from "react-icons/fa"
import { server } from "../redux/store";
import { CartItem } from "../types/types";
type ProductCardProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined
}

const ProductCard = ({ productId, photo, name, price, stock, handler }: ProductCardProps) => {
  return (
    // uplaods\234242r42.png
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>Rs {price}</span>

      <div>
        <button onClick={() => handler({ productId, name, price, quantity: 1, stock, photo })}>
          <FaPlus />
        </button>
      </div>
    </div>
  )
}

export default ProductCard