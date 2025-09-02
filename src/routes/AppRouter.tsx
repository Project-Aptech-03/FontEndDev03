import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Checkout from "../pages/Checkout";
import Shop from "../pages/Shop";
import DetailProduct from "../pages/DetailProduct";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import Blog from "../pages/Blog";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import WishlistPage from "../pages/Wishlist";
import Users from "../pages/admin/Users";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Manufacturers from "../pages/admin/Manufacturers";
import Stocks from "../pages/admin/Stocks";
import Orders from "../pages/admin/Orders";
import Coupons from "../pages/admin/Coupons";
import Profile from "../pages/Profile";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import MyOrders from "../pages/MyOrders";
import { AuthProvider } from "../api/AuthContext";

export const AppRouter = () => (
    <AuthProvider>
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
            </Route>

            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/detail-product/:id" element={<DetailProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/myorders" element={<MyOrders />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="manufacturers" element={<Manufacturers />} />
                <Route path="stocks" element={<Stocks />} />
                <Route path="orders" element={<Orders />} />
                <Route path="coupons" element={<Coupons />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthProvider>
);
