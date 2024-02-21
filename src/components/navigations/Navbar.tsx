import React, { Component, useEffect, useState } from "react";
import {
  MenuItem,
  Menu,
  MenuMenu,
  Input,
  Container,
  Popup,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownHeader,
  Dropdown,
  Icon,
} from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>();
  const queryClient = useQueryClient();

  const handleItemClick = (activeItem: string) => {
    setActiveItem(activeItem);
    // queryClient.removeQueries({
    //   queryKey: ["post"],
    // });
    navigate("/" + activeItem);
  };

  const { token, user, logout } = useAuth();
  const trigger = (
    // <div className="flex flex-row gap-x-1 items-center">
    //   <Image
    //     className="cursor-pointer"
    //     src="/images/profile_pic_example.jpg"
    //     avatar
    //   />
    //   <div className="flex flex-col">
    //     <span className="text-md font-bold">{user.username}</span>
    //     <span className="text-sm">{user.email}</span>
    //   </div>
    //   <ChevronDown size={16} />

    // </div>
    <span>
      <Image className="cursor-pointer" src={user.profileImage} avatar />
      <span>
        <span className="text-md font-bold">{user.name}</span>
      </span>
    </span>
  );

  const handleDropdown = (value: any) => {
    if (value === "sign-out") {
      logout();
    }

    if (value === "profile") {
      navigate(`/u/${user.username}`);
    }
  };

  const options = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.username}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "profile",
      text: "Your Profile",
      value: "profile",
      onClick: () => handleDropdown("profile"),
    },
    { key: "help", text: "Help" },
    { key: "settings", text: "Settings" },
    {
      key: "sign-out",
      text: "Sign Out",
      value: "sign-out",
      onClick: () => handleDropdown("sign-out"),
    },
  ];

  return (
    <Menu inverted className="w-full !rounded-none z-50">
      <MenuItem onClick={() => handleItemClick("")}>
        <div className="flex flex-row gap-x-2 items-center">
          <Image src="/icons/panda.png" className="w-10 h-10"/>
          <h2 className="!mt-0">Panda</h2>
        </div>
      </MenuItem>

      <MenuItem
        name="Trending"
        active={activeItem === "trending"}
        onClick={() => handleItemClick("trending")}
      />
      <MenuItem
        name="Bookmarks"
        active={activeItem === "bookmarks"}
        onClick={() => handleItemClick("bookmarks")}
      />
      <div className="ml-[20%] mr-auto flex items-center">
        <Input
          icon="search"
          placeholder="Search..."
          className="w-[500px] h-8"
        />
      </div>
      <MenuMenu position="right">
        {token && (
          <MenuItem className="cursor-pointer flex flex-row  items-center">
            <Dropdown
              trigger={trigger}
              options={options}
              className="flex flex-row items-center"
            />
          </MenuItem>
        )}

        {!token && (
          <MenuItem
            className="cursor-pointer flex flex-row  items-center"
            onClick={() => navigate("/sign-in")}
          >
            <span>Sign in</span>
          </MenuItem>
        )}
      </MenuMenu>
    </Menu>
  );
};

export default Navbar;
