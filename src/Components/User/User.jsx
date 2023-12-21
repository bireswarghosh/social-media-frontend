import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
const User = ({ userId, name, avatar }) => {
  return (
    //  this User page show on  right side  of home page . in right side  show user id(if i click this user id then open user account ) ,user avatar and user name. //*  every user have different user id so so for dynamic user id i use  ${userId} when i click any is then automatically chenge user`s id

    <Link to={`/user/${userId}`} className="homeUser">
      <img src={avatar} alt={name} />
      <Typography>{name}</Typography>
    </Link>
  );
};

export default User;
