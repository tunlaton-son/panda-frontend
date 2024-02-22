import React, { useState } from "react";
import { Form, TextArea, Icon, Button } from "semantic-ui-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  body: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

interface PostBoxProps {
  postId?: string;
  onClose?: () => void;
}

const PostBox = ({ postId, onClose }: PostBoxProps) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      body: "",
    },
    resolver: zodResolver(schema),
  });

  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<FormFields> = async (data, e) => {
    if (!postId) {
      try {
        const res = await axios.post("/api/v1/post", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status !== 200) {
          toast.error("Post Fail!");
          return;
        }

        toast.success("Post Success!");
        setValue("body", "");
        queryClient.refetchQueries({
          queryKey: ["post"],
        });

        e?.target.reset();
        return res.data;
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const res = await axios.post(
          "/api/v1/post/reply",
          {
            postId: postId,
            body: data.body,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status !== 200) {
          toast.error("Reply Fail!");
          return;
        }

        toast.success("Reply Success!");
        setValue("body", "");
        if (onClose) {
          onClose();
        }

        queryClient.refetchQueries({
          queryKey: ["comments"],
        });

        e?.target.reset();
        navigate(`/post/${postId}`);
        return res.data;
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Form className="w-full relative border-b border-gray" onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        
        placeholder="Express your idea"
        style={{ width: "100%", minHeight: 100, borderRadius: 0, borderLeft: 0, borderRight: 0}}
        name="body"
        onChange={async (e, { name, value }) => {
          setValue(name, value);
        }}
      />
      <div className="w-full h-auto grid grid-cols-2 mobile:grid-cols-1 pt-[8px] pb-[8px] pl-2 pr-2">
        <div className="flex">
          <Button icon>
            <Icon name="image" />
          </Button>
          <Button icon>
            <Icon name="linkify" />
          </Button>
        </div>
        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit" primary>
            {isSubmitting ? (
              <div className="w-full flex justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
            ) : postId ? (
              "Reply"
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default PostBox;
