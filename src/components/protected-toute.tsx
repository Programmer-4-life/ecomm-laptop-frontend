import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminRoute?: boolean;
  isAdmin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({ isAuthenticated, children, adminRoute, isAdmin, redirect = "/" }: Props) => {

  if (!isAuthenticated) {
    return <Navigate to={redirect} />
  }

  if (adminRoute && !isAdmin) {
    return <Navigate to={redirect} />
  }

  return children ? children : <Outlet />

  //Outlet isliye use kiya hai takey nexted route py baar baar element k ander ProetctedRoute na likhna parey

  /* logged in user hi ye route access kr skta hai and these are nested routes
  <Route element={<ProtectedRoute isAuthenticated={user ? true : false} />}>
    <Route path="/shipping" element={<Shipping />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/order/:id" element={<OrderDetails />} />
  </Route>
  */
}

export default ProtectedRoute