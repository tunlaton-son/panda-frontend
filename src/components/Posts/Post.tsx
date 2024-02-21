import React, { useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { Comment, Post as PostType } from "../../interface";
import { PostItem, PostItemSkeleton } from "./PostItem";
import { usePostStore } from "../../store/postStore";
import PostBox from "./PostBox";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Feather, Loader2 } from "lucide-react";
import CommentItem from "../Comments/CommentItem";
import { useInView } from "react-intersection-observer";
import useSWR from "swr";

interface PostProps {}

const Post = ({}: PostProps) => {
  let { id } = useParams();
  const { token } = useAuth();

  const fetchCommentsById = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(
      `/api/v1/comments?postId=${id}&page=${pageParam}&size=10`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.json();
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
    queryKey: ["comments"],
    queryFn: fetchCommentsById,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const fetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

  const {
    data: postData,
    error: postError,
    isLoading,
  } = useSWR(`/api/v1/post/id?id=${id}`, fetcher);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="pt-[16px] border-l border-r min-h-screen h-auto">
      {!isLoading && <PostItem post={postData}/>}
      {isLoading && <PostItemSkeleton />}
      {id && token && <PostBox postId={id} />}

      {!token && (
        <div className="w-full flex flex-col items-center">
          <div className="p-[25px]">
            <span className="font-bold">Sign-in to Express your idea</span>
          </div>
          <hr className="w-full h-[0.5px] bg-gray-200  mt-[16px] mb-[16px]" />
        </div>
      )}

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
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((comment: Comment, index: number) => {
                  if (
                    group.data.length >= 3 &&
                    group.data.length - 3 === index
                  ) {
                    return (
                      <div className="w-full" key={index} ref={ref}>
                        <CommentItem comment={comment} />
                      </div>
                    );
                  }

                  return (
                    <div className="w-full" key={index}>
                      <CommentItem comment={comment} />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="w-full flex justify-center p-[16px]">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
