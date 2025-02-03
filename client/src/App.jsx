import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { fetchImages } from "./redux/action";
import AdminPage from "./pages/AdminPage";
import ShowImagesById from "./pages/ShowImagesById";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const userDetails = JSON.parse(localStorage.getItem("userCred")) || {};

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin-page"
        element={
          <ProtectedRoute isAdmin={userDetails?.isAdmin}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      {/* {!userDetails.isAdmin ? <Home /> : <AdminPage />} */}
      <Route path="/" element={<Home />} />
      <Route path="/images/:byId" element={<ShowImagesById />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
