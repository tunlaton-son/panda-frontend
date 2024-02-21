import React from "react";
import { Image, Container } from "semantic-ui-react";
import { Comment } from "../../interface";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CommentItemProps {
  comment: Comment;
}
const CommentItem = ({ comment }: CommentItemProps) => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const gotToProfile = (e: any) => {
    e.preventDefault();
    queryClient.removeQueries({
      queryKey: ["postById"],
    });
    navigate(`/u/${comment.username}`);
  };

  return (
    <div className="grid grid-cols-12 cursor-pointer hover:bg-opacity-75 relative p-4 border-b border-gray">
      <div onClick={gotToProfile} className="col-span-1">
        <Image
          className="cursor-pointer"
          src={comment.profileImage ?? ""}
          avatar
        />
      </div>
      <div className="col-span-11">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{comment.name}</span>
          <span className="text-sm text-gray-400">@{comment.username}</span>
        </div>
        <Container textAlign="left" className="break-all">
          {comment.body}
        </Container>
      </div>
    </div>
  );
};

export default CommentItem;
