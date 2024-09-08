import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  total: 0,
  shippingCharges: 0,
  tax: 0,
  discount: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
}

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;

      const index = state.cartItems.findIndex((item) => item.productId === action.payload.productId);

      if (index >= 0) {
        const cartItems = state.cartItems[index];
        cartItems.quantity = action.payload.quantity;
      }
      else {
        state.cartItems.push(action.payload);
      }

      state.loading = false;
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;

      state.cartItems = state.cartItems.filter((item) => item.productId !== action.payload);

      state.loading = false;
    },

    calculatePrice: (state) => {
      // let subTotal = 0;

      // for(let i = 0; i < state.cartItems.length; i++) {
      //   const item = state.cartItems[i];
      //   subTotal += item.price * item.quantity
      // }

      //shorter version of above for is reduce below
      // .reduce((prev value, current value),0) // 0 initially
      const subTotal = state.cartItems.reduce((prev, item) => prev + item.price * item.quantity, 0)

      state.subtotal = subTotal;
      state.shippingCharges = state.subtotal > 1000 ? 0 : state.subtotal > 0 ? 200 : 0;
      state.tax = Math.round(state.subtotal * 0.18);
      //so the total should not be in negative
      const calculatedTotal = state.subtotal + state.tax + state.shippingCharges - state.discount;
      state.total = Math.max(0, calculatedTotal);
    },

    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload
      // Trigger price recalculation after applying discount
      cartReducer.caseReducers.calculatePrice(state);
    },

    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },

    resetCart: () => initialState,
  }
})

export const { addToCart, removeCartItem, calculatePrice, discountApplied, saveShippingInfo, resetCart } = cartReducer.actions;
export default cartReducer.reducer