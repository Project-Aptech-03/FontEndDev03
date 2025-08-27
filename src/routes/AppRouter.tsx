import React from "react";
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
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../admin/dashboard";
import Users from "../admin/Users";
import Products from "../admin/Products";
import WishlistPage from "../pages/wishlist";

export const AppRouter = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/detail-product/:id" element={<DetailProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="products" element={<Products />} />
    </Route>
  </Routes>
);
