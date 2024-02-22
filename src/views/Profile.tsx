import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Image,
  Button,
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Modal,
} from "semantic-ui-react";

import { useAuth } from "../hooks/useAuth";
import { TabPane, Tab } from "semantic-ui-react";
import Posts from "../components/Posts/Posts";
import EditProfile from "../components/Profile/EditProfile";
import axios from "axios";
import useSWR from "swr";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../utils";
import { toast } from "sonner";
import { FastForward, Loader2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export const Profile = () => {
  const { username } = useParams();
  const { token, user } = useAuth();

  const [open, setOpen] = useState(false);

  const fetcher = (url: string) =>
  axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

  const {
    data: profile,
    error,
    isLoading,
    mutate: fetchProfile,
  } = useSWR(`/api/v1/user?username=${username}`, fetcher);

  const [requestingFollow, setRequestingFollow] = useState<boolean>(false);
  const follow = async () => {
    setRequestingFollow(true);
    try {
      await axiosInstance.post(
        `/api/v1/following`,
        {
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProfile().finally(() => {
        setRequestingFollow(false);
      });
    } catch (error) {
      console.error(error);
      setRequestingFollow(false);
      toast.error("Something went wrong!");
    }
  };

  const panes = [
    {
      menuItem: "Posts",
      render: () => (
        <TabPane attached={false} className="!h-full !p-0">
          {profile ? (
            <Posts isProfile userName={username} />
          ) : (
            <div className="w-full flex justify-center">No Account</div>
          )}
        </TabPane>
      ),
    },
    {
      menuItem: "Replies",
      render: () => (
        <TabPane attached={false}>
          <div className="w-full flex flex-row justify-center">
            <span>No replies</span>
          </div>
        </TabPane>
      ),
    },
    {
      menuItem: "Gallery",
      render: () => (
        <TabPane attached={false}>
          <div className="w-full flex flex-row justify-center">
            <span>No gallery</span>
          </div>
        </TabPane>
      ),
    },
    {
      menuItem: "Video",
      render: () => (
        <TabPane attached={false}>
          <div className="w-full flex flex-row justify-center">
            <span>No video</span>
          </div>
        </TabPane>
      ),
    },
  ];

  return (
    <div className="border-l border-r border-gray-300 h-auto min-h-[1080px] ">
      <div
        className={cn(
          "w-full  h-[250px] relative",
          profile?.coverImage ? "" : "bg-[#d1dbe0]",
          isLoading && "skeleton"
        )}
      >
        <div className="w-full h-full absolute">
          {profile?.coverImage && (
            <Image className="w-full h-full" src={profile?.coverImage ?? ""} />
          )}
        </div>

        {profile?.profileImage && (
          <div className="!border-2 !border-white absolute bottom-[-35px] left-5 rounded-full w-[80px] h-[80px]">
            <Image
              className="cursor-pointer !w-full !h-full"
              src={profile?.profileImage ?? ""}
              avatar
            />
          </div>
        )}

        {!profile?.profileImage && (
          <div
            className={cn(
              "cursor-pointer absolute bottom-[-35px] left-5 w-[80px] !h-[80px] bg-[#d1dbe0] border-2 border-gray rounded-full",
              true && "skeleton"
            )}
          ></div>
        )}
      </div>

      <div className="w-full h-auto flex flex-row justify-end pr-4 min-h-[36px] mt-[16px] gap-x-2">
        {username !== user.username && token && (
          <Button
            basic
            className={cn("!rounded-full")}
            onClick={() => {
              follow();
            }}
          >
            {!requestingFollow && (
              <>{!isLoading && profile?.following ? "Unfollow" : "Follow"}</>
            )}

            {requestingFollow && <Loader2 size={16} className="animate-spin" />}
          </Button>
        )}

        {username === user.username && (
          <Modal
            size="tiny"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            closeIcon={true}
            trigger={
              <Button basic className="!rounded-full">
                Edit
              </Button>
            }
          >
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalContent>
              <EditProfile 
                fetchProfile={fetchProfile} 
                setOpen={setOpen}
              />
            </ModalContent>
          </Modal>
        )}
      </div>
      <div className="w-full p-[16px]">
        <div className="w-full flex flex-col">
          <span className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-4 !w-32 skeleton skeleton-text" />
            ) : (
              profile?.name
            )}
          </span>
          <span className="text-md text-gray-400">
            {" "}
            {isLoading ? (
              <Skeleton className="h-4 !w-24 skeleton skeleton-text" />
            ) : (
              <>@{username}</>
            )}{" "}
          </span>
        </div>

        <div className="w-full flex flex-row gap-x-4">
          <div className="flex flex-row gap-x-1">
            <span className="font-bold">0</span>
            <span className="font-thin">Following</span>
          </div>
          <div className="flex flex-row gap-x-1">
            <span className="font-bold">0</span>
            <span className="font-thin">Followers</span>
          </div>
        </div>
      </div>
      <div className="w-full !h-full mt-[16px]">
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </div>
    </div>
  );
};
