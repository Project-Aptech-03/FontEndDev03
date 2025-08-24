import React, { useState, useEffect } from "react";

import { ProductService } from "./services/productService.js";
import { AuthService } from "./services/authService.js";
import { AppRouter } from "./routes/AppRouter.js";

function App() {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (form) => {
    const response = await AuthService.login(form);
    if (response.success) {
      setIsAuthenticated(true);
      // Lưu token nếu API trả về
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    }
    return response;
  };

  const handleRegister = async (form) => {
    try {
      const response = await AuthService.register(form);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      return error.response;
    }
  };

  const handleVerifyOtp = async (form) => {
    const response = await AuthService.verifyOtp(form);
    if (response.success) {
      setIsAuthenticated(true);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
    }
    return response;
  };

  const handleResendOtp = async (email) => {
    const response = await AuthService.resendOtp(email);
    if (response.success) {
      localStorage.setItem("pendingEmail", email);
    }
    return response;
  };

  // CRUD methods
  // const handleCreateProduct = async (prod) => {
  //   await ProductService.create(prod);
  //   fetchProducts();
  // };
  // const handleUpdateProduct = async (id, prod) => {
  //   await ProductService.update(id, prod);
  //   fetchProducts();
  // };
  // const handleDeleteProduct = async (id) => {
  //   await ProductService.delete(id);
  //   fetchProducts();
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   setIsAuthenticated(false);
  //   return <Navigate to="/auth" />;
  // };

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
