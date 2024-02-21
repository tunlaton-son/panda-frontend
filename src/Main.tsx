import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Trending from "./views/Trending";
import Signin from "./views/Signin";
import Signup from "./views/Signup";
import { ProtectedRoute } from "./components/Route/ProtectedRoute";
import { UnProtectedRoute } from "./components/Route/UnProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import Post from "./components/Posts/Post";
import { useEffect } from "react";
import { Profile } from "./views/Profile";

const Main = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/trending" element={<Trending />} />
      <Route
        path="/sign-in"
        element={
          <UnProtectedRoute>
            <Signin />
          </UnProtectedRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <UnProtectedRoute>
            <Signup />
          </UnProtectedRoute>
        }
      />
      <Route path="/post/:id" element={<Post />} />
      <Route path="/u/:username" element={<Profile />} />
    </Routes>
  );
};

export default Main;
