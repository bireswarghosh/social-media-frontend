import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost } from "../../Actions/Post";
import { loadUser } from "../../Actions/User";
import "./NewPost.css";
const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const { loading, error, message } = useSelector((state) => state.like); // when i trigger any dispatch then select it`s reducer  and show it`s err or massage
  const dispatch = useDispatch();
  const alert = useAlert();

  const handleImageChange = (e) => {
    // when you click any chose image  button  then open my file explore and select img and upload   
    const file = e.target.files[0]; // to target button

    const Reader = new FileReader(); // it help to open file explore
    Reader.readAsDataURL(file); // next read to file and convert it url via cloudinary 

    Reader.onload = () => {
      if (Reader.readyState === 2) { // Reader.readyState basically readyState have 3 state --> 0 mean initials , 1 mean processing and 2 mean ok , ready for uploading
        setImage(Reader.result); // then store img in setImage hook
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createNewPost(caption, image)); // when from submit
    dispatch(loadUser());
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message, alert]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h3">New Post</Typography>

        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
