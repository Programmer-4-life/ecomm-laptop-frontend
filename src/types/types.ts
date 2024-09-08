export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
}

export type Product = {
  name: string;
  category: string;
  photo: string;
  price: number;
  stock: number;
  _id: string;
}

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  photo: string;
  quantity: number;
}

// export type OrderItem = {
//   productId: string;
//   _id: string;
//   name: string;
//   price: number;
//   photo: string;
//   quantity: number;
// }

// Above can be written as
export type OrderItem = Omit<CartItem, "stock"> & { _id: string }

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  total: number;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
}

type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
}

type LatestTransaction = {
  _id: string;
  discount: number;
  quantity: number;
  amount: number;
  status: string;
}

export type Stats = {
  categoryCount: Record<string, number>[];
  changePercentage: CountAndChange;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  }
  userRatio: {
    male: number;
    female: number;
  };
  latestTransactions: LatestTransaction[];
}

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
}

type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
}

type UsersAgeGroup = {
  teen: number;
  adult: number;
  old: number;
}

export type Pie = {
  orderFullfillment: OrderFullfillment,
  productCategories: Record<string, number>[],
  stockAvailibility: {
    inStock: number;
    outOfStock: number;
  },
  revenueDistribution: RevenueDistribution,
  adminCustomer: {
    admin: number;
    customer: number;
  },
  usersAgeGroup: UsersAgeGroup,
}

export type Bar = {
  users: number[],
  products: number[],
  orders: number[],
}

export type Line = {
  users: number[],
  products: number[],
  discount: number[],
  revenue: number[],
}