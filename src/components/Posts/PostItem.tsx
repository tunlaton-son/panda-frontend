import React, { useEffect } from "react";
import { Container, Icon, Image } from "semantic-ui-react";
import { Heart, MessageCircle, Share } from "lucide-react";
import { Post } from "../../interface";
import PostBox from "./PostBox";
import { usePostStore } from "../../store/postStore";

import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Header,
  Modal,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../ui/Skeleton";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "../../utils";

interface PostItemProps {
  post: Post;
}

export const PostItem = ({ post }: PostItemProps) => {
  const [open, setOpen] = React.useState(false);
  const [liked, setLiked] = React.useState<boolean>(post.liked);
  const [likedCount, setLikedCount] = React.useState<number>(post.likedCount);

  const { setPost } = usePostStore();
  const { token, user } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const goToPost = (e: any) => {
    e.preventDefault();
    setPost(post);

    queryClient.removeQueries({
      queryKey: ["comments"],
    });
    navigate(`/post/${post.id}`);
  };

  const gotToProfile = (e: any) => {
    e.preventDefault();
    queryClient.removeQueries({
      queryKey: ["postById"],
    });
    navigate(`/u/${post.username}`);
  };

  const onClose = () => {
    setOpen(false);
  };

  const likePost = async () => {
    try {
      await axios({
        url: `/api/v1/post/like?id=${post.id}&username=${user.username}`,
        method: "patch",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          // toast.success("Like success");
          queryClient.refetchQueries({
            queryKey: ["post"],
          });
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.error(err);
        });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      onClick={goToPost}
      className="grid grid-cols-12 cursor-pointer hover:bg-opacity-75 relative p-4  border-b border-gray hover:bg-gray-100"
    >
      <div
        className="col-span-1"
        onClick={(e) => {
          e.stopPropagation();
          gotToProfile(e);
        }}
      >
        <Image
          className="cursor-pointer"
          src={post.profileImage ?? ""}
          avatar
        />
      </div>
      <div className="col-span-11">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{post.name}</span>
          <span className="text-sm text-gray-400">@{post.username}</span>
        </div>
        <Container textAlign="left" className="break-all">
          {post.body}
        </Container>
        <div className="flex flex-row gap-x-5 mt-[8px]">
          <div className="flex flex-row gap-1 items-center text-gray-400 text-md cursor-pointer">
            <Heart
              size={16}
              onClick={(e) => {
                e.stopPropagation();

                if(!token) return;

                setLiked(!liked);
                setLikedCount(liked ? (likedCount - 1) : (likedCount + 1));
                likePost();
              }}
              color={liked ? "#E11D48 " : "gray"}
              fill={liked ? "#E11D48 " : "white"}
            />
            <span>
              {likedCount >= 1000
                ? likedCount / 1000 + "K"
                : likedCount}
            </span>
          </div>

          <Modal
            closeIcon={true}
            onClose={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            onOpen={(e) => {
              e.stopPropagation();
              if (!token) {
                return;
              }
              setOpen(true);
            }}
            open={open}
            trigger={
              <div className="flex flex-row gap-1 items-center text-gray-400 text-md cursor-pointer">
                <MessageCircle size={16} />
                <span>
                  {post.commentCount >= 1000
                    ? post.commentCount / 1000 + "K"
                    : post.commentCount}
                </span>
              </div>
            }
          >
            <ModalHeader
              onClick={(e: any) => {
                e.stopPropagation();
              }}
            >
              Reply
            </ModalHeader>
            <ModalContent
              image
              onClick={(e: any) => {
                e.stopPropagation();
              }}
            >
              <PostBox postId={post.id} onClose={onClose} />
            </ModalContent>
          </Modal>

          <div className="flex flex-row gap-1 items-center text-gray-400 text-md cursor-pointer">
            <Share size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PostItemSkeleton = () => {
  return (
    <div className="grid grid-cols-12 cursor-pointer hover:bg-opacity-75 relative p-4 border-b border-gray">
      <div className="col-span-1">
        <img
          className="card__header header__img skeleton rounded-full p-5"
          id="logo-img"
          alt=""
        />
      </div>
      <div className="col-span-11">
        <div className="flex flex-col">
          <span className="text-lg font-bold">
            <Skeleton className="skeleton skeleton-text" />
          </span>
          <span className="text-sm text-gray-400">
            <Skeleton className="skeleton skeleton-text" />
          </span>
        </div>
        <Container textAlign="left" className="break-all">
          <Skeleton className="skeleton skeleton-text" />
          <Skeleton className="skeleton skeleton-text" />
          <Skeleton className="skeleton skeleton-text" />
          <Skeleton className="skeleton skeleton-text" />
          <Skeleton className="skeleton skeleton-text" />
        </Container>
        <div className="flex flex-row gap-x-5 mt-[8px]">
          <div className="flex flex-row gap-1 items-center text-gray-400 text-md cursor-pointer">
            <Skeleton className="!w-64 skeleton skeleton-text" />
          </div>
        </div>
      </div>
    </div>
  );
};
