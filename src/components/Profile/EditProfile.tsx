import React, { useEffect, useState } from "react";
import { Image, Input, Button, Form } from "semantic-ui-react";
import { Camera, ImagePlus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../../interface";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

interface EditProfileProps {}

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<File>();
  const [coverImage, setCoverImage] = useState<File>();

  const { token, user, refreshToken, logout } = useAuth();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setProfileImage(selectedFiles?.[0]);
  }

  function handleChangeCoverImage(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setCoverImage(selectedFiles?.[0]);
  }

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: user.name,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      let formData = new FormData();

      formData.append("profilePath", "profile/");
      if (typeof profileImage !== "undefined") {
        formData.append("profileImage", profileImage);
      }

      formData.append("coverPath", "cover/");
      if (typeof coverImage !== "undefined") {
        formData.append("coverImage", coverImage);
      }

      const jsonData = {
        name: data.name,
        username: user.username,
      };
      formData.append("data", JSON.stringify(jsonData));

      await axios({
        url: "/api/v1/user",
        method: "patch",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      })
        .then((res) => {
          toast.success("Save success");
          refreshToken(res.data.token);
          window.location.reload();
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.error(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form className="w-full relative" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex flex-col gap-y-2">
        <div
          className={cn(
            "w-full  h-[250px] relative",
            coverImage ? "" : "bg-gray-200"
          )}
        >
          <div className="w-full h-full absolute">
            <Image
              className="w-full h-full"
              src={
                coverImage ? URL.createObjectURL(coverImage) : user.coverImage
              }
            />
          </div>
          <div className="relative">
            <Image
              className="absolute bottom-[-205px] left-5 z-10 bg !max-h-[80px]"
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : user.profileImage
              }
              avatar
              size="tiny"
            />
            <div className="absolute bottom-[-185px] left-[40px] z-10 cursor-pointer">
              <div className="w-fit relative z-20 cursor-pointer">
                <ImagePlus
                  className="cursor-pointer bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-30"
                  color="white"
                  size={35}
                />
                <input
                  type="file"
                  disabled={isSubmitting}
                  className="opacity-0 absolute w-[35px] h-[35px] bottom-[0%] cursor-pointer"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-[40%] left-[45%] z-10">
            <div className="w-fit relative z-20">
              <ImagePlus
                className=" cursor-pointer bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-30"
                color="white"
                size={35}
              />
              <input
                type="file"
                disabled={isSubmitting}
                className="opacity-0 absolute w-[35px] h-[35px] bottom-[0%] cursor-pointer"
                onChange={handleChangeCoverImage}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-y-2 mt-14">
          <Input
            type="text"
            className="w-full"
            name="name"
            placeholder="Name"
            defaultValue={user.name}
            disabled={isSubmitting}
            onChange={async (e, { name, value }) => {
              setValue(name, value);
            }}
          />
        </div>
        <div className="w-full flex flex-row justify-end">
          <Button
            disabled={isSubmitting}
            type="submit"
            primary
            className="w-full"
          >
            {isSubmitting ? (
              <div className="w-full flex justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default EditProfile;
