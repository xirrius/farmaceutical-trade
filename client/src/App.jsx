import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./redux/state/authSlice";
import { fetchAllConversations } from "./redux/state/messageSlice";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { initSocketListeners } from "./utils/socket.js";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile.jsx";
import Layout from "./components/Layout.jsx";
import OtherProfile from "./pages/OtherProfile.jsx";
import Products from "./pages/Products.jsx";
import MyProducts from "./pages/MyProducts.jsx";
import Product from "./components/Product.jsx";
import Transactions from "./pages/Transactions.jsx";
import Transaction from "./components/Transaction.jsx";
import Rentals from "./pages/Rentals.jsx";
import Rental from "./components/Rental.jsx";
import Conversations from "./pages/Conversations.jsx";
import Conversation from "./components/Conversation.jsx";
import AddProduct from "./components/AddProduct.jsx";
import NotFound from "./pages/NotFound.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import PredictModel from "./pages/PredictModel.jsx";
import { wakeModel } from "./utils/model-warmup.js";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    wakeModel();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      initSocketListeners();
      dispatch(fetchAllConversations());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <NotFound />}
            />
            <Route path="/profile/:id" element={<OtherProfile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/predict" element={<PredictModel />} />
            <Route
              path="/products/my"
              element={isAuthenticated ? <MyProducts /> : <NotFound />}
            />
            <Route
              path="/products/add"
              element={isAuthenticated ? <AddProduct /> : <NotFound />}
            />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/products/:id/edit" element={<EditProduct />} />
            <Route
              path="/transactions"
              element={isAuthenticated ? <Transactions /> : <NotFound />}
            />
            <Route
              path="/transactions/:id"
              element={isAuthenticated ? <Transaction /> : <NotFound />}
            />
            <Route
              path="/rentals/"
              element={isAuthenticated ? <Rentals /> : <NotFound />}
            />
            <Route
              path="/rentals/:id"
              element={isAuthenticated ? <Rental /> : <NotFound />}
            />
            <Route
              path="/conversations/"
              element={isAuthenticated ? <Conversations /> : <NotFound />}
            />
            <Route
              path="/conversations/:id"
              element={isAuthenticated ? <Conversation /> : <NotFound />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
