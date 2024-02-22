import React, { useEffect, useState, useRef, ElementRef } from "react";
import { PostItem, PostItemSkeleton } from "./PostItem";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Post } from "../../interface";
import { useAuth } from "../../hooks/useAuth";
import { usePositionStore } from "../../store/positionStore";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

interface PostsProps {
  isProfile?: boolean;
  userName?: string;
}

const Posts = ({ isProfile, userName }: PostsProps) => {
  const [page, setPage] = useState(0);
  const { topRef, bottomRef } = usePositionStore();
  const { ref, inView } = useInView();
  const { token, user } = useAuth();

  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
    if (isProfile && !userName) {
      return [];
    }

    let url = isProfile
      ? "/api/v1/post?page=" + pageParam + "&size=10&username=" + userName
      : "/api/v1/post?page=" + pageParam + "&size=10";

    // const res = await fetch(url, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    const res = await axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [isProfile ? "postById" : "post"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: 1000,
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="w-full">
      {status === "pending" ? (
        <div>
          <PostItemSkeleton />
          <PostItemSkeleton />
          <PostItemSkeleton />
          <PostItemSkeleton />
          <PostItemSkeleton />
        </div>
      ) : status === "error" ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group?.data?.map((post: Post, index: number) => {
                if (group.data.length >= 3 && group.data.length - 3 === index) {
                  return (
                    <div className="w-full" key={index} ref={ref}>
                      <PostItem post={post} />
                      {/* <hr className="w-full h-[0.5px] bg-gray-200  mt-[16px] mb-[16px]" /> */}
                    </div>
                  );
                }

                return (
                  <div className="w-full" key={index}>
                    <PostItem post={post} />
                    {/* <hr className="w-full h-[0.5px] bg-gray-200  mt-[16px] mb-[16px]" /> */}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      {status === "success" && data?.pages[0]?.length <= 0 && (
        <div className="w-full flex flex-row justify-center">
          <span>No posts</span>
        </div>
      )}

      {isFetchingNextPage && (
        <div className="w-full flex justify-center p-[16px]">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Posts;
