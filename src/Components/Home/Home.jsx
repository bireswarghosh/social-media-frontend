import React, { useEffect } from "react";
// import Post from "../Post/Post";
import { Post } from '../Post/Post';
import User from "../User/User";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getFollowingPosts } from "../../Actions/User";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, posts, error } = useSelector(
    (state) => state.postOfFollowing
  );
        // hear loading name already use in line 15  so, hear change name via  usersLoading using this  loading: usersLoading--> loading as usersLoading
  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  );

  const { error: likeError, message } = useSelector((state) => state.like);//error as likeError

  useEffect(() => {
    dispatch(getFollowingPosts());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) { // post err
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (likeError) { // when like if that moment have any err
      alert.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) { // if successfully like or un like then show massage 
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, message, likeError, dispatch]);

  return loading === true || usersLoading === true ? (
    <Loader />
  ) : (
    <div className="home">

         {/* left side show post */}
      <div className="homeleft">
   
   
   
        {posts && posts.length > 0 ? (
          posts.map((post) => (
           
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
            />   // this all data come from backend\controllers\post.js\142 . in redux  after populate now i get all data of user who like my post 
          ))
        ) : (
          <Typography variant="h6">No posts yet</Typography>
        )}
      </div>

         {/* right side show user  */}
      <div className="homeright">
        {/* hear users arr come from state.allUsers  */}
        {users && users.length > 0 ? (  
          users.map((user) => (
            <User
              key={user._id}
              userId={user._id}
              name={user.name}
              avatar={user.avatar.url}
            /> // this User components
          ))
        ) : (
          <Typography>No Users Yet</Typography>
        )}
      </div>
    </div>
  );
};

export default Home;
