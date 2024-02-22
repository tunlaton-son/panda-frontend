import React, { useRef } from "react";
import PostBox from "../components/Posts/PostBox";
import Posts from "../components/Posts/Posts";
import { useAuth } from "../hooks/useAuth";
import { ElementRef } from "react";
import { useEffect } from "react";

const Home = () => {
  const { token } = useAuth();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="w-full h-auto min-h-screen pt-[16px]  pb-[150px] border-l border-r border-gray-300">
      {token && <PostBox />}
      <Posts />
    </div>
  );
};

export default Home;
