import {useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom";


//private route - profile page is protected
//if user is signed in, navigate to profile page (Outlet), show image in header, otherwise navigate the user to sign in page

export default function PrivateRoute() {

    const {currentUser} = useSelector((state) => state.user);

  return currentUser ? <Outlet/> : <Navigate to='signin' />;
}
