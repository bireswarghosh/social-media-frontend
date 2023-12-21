import { Avatar, Button, Typography, Dialog } from "@mui/material";
import React, { useEffect } from "react";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentOnPost,
  deletePost,
  likePost,
  updatePost
} from "../../Actions/Post";
import { getFollowingPosts, getMyPosts, loadUser } from "../../Actions/User";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";

export const Post = ({
  postId, caption, postImage, likes = [], comments = [], ownerImage, ownerName, ownerId,
  // this 2 is flash because it is use for this post Components  use for home page in home page you  can not access to delate other user post so isDelete = false, . and next ,i use same post page in user account there user can see their post then isAccount = true but hear i use it in home page so, isAccount = false
  isDelete = false, isAccount = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);// this use for update caption so initial state i add old caption mean when i update caption then i show i my old caption so for use --> useState(caption)
  const [captionToggle, setCaptionToggle] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLike = async () => {
    setLiked(!liked);

    await dispatch(likePost(postId)); // if like successfully then add user id  in likes arr  . until it ok not run lower line of code

    if (isAccount) { // if open my account  
      dispatch(getMyPosts());
    } else { // if not my account mean generally you use this 
      dispatch(getFollowingPosts()); // in this action (getFollowingPosts)  hear store all details of post how many like ,comment .     when i like or unlike at that moment do not update like or comment counting so after like or un like i update or dispatch this this reducer.              using this i want know how many like at a certain time 
    }
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(addCommentOnPost(postId, commentValue)); // when comment form submit then dispatch post id and comment value on addCommentOnPost action . 

    if (isAccount) {
      dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPosts());  // after comment fetch comment data by getFollowingPosts action 
    }
  };

  const updateCaptionHandler = (e) => {
    e.preventDefault();
    dispatch(updatePost(captionValue, postId));
    dispatch(getMyPosts());
  };

  const deletePostHandler = async () => {
    await dispatch(deletePost(postId)); // use for  delete post which post id passed
    dispatch(getMyPosts()); // use for after delete any post , removed from my account post page 
    dispatch(loadUser()); // use for , delete post , then in right side of my account post count will be check 
  };



  //!  bug --> if i like any post then refresh the page , then  automatically goes out my like post like state come back on their  1st position that setLike= flash mean unlike        
  // * fix --> post likes arr check that my id is present on this arr if yes then change state and make it setLike = true
  useEffect(() => {
    likes.forEach((item) => { // find my id mean user._id all likes arr
      if (item._id === user._id) { // item._id mean all over likes arr === user._id   come from //! line 36 from state.user
        setLiked(true); // then true
      }
    });
  }, [likes, user._id]);

  return (
    <div className="post">
      <div className="postHeader">
        {isAccount ? (
          <Button onClick={() => setCaptionToggle(!captionToggle)}>
            <MoreVert /> {/* if is account = true mean owner account then show this icon(vertically 3 dot) */}
          </Button>
        ) : null}
      </div>

      {/* todo --> add post size  .        i do not write what is post size if post size like 100/100 */}
      <img src={postImage} alt="Post" />

      <div className="postDetails">
        {/*  this Avatar come from material ui if don`t passed sre then material ui give default img */}
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
          }} />

        {/* if click owner name then open owner account  */}
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0, 0, 0, 0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>

      <button
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length === 0 ? true : false}
      >
        <Typography>{likes.length} Likes</Typography>
      </button>

      <div className="postFooter">
        <Button onClick={handleLike}>   {/* if any one click this button then run this handler --> handleLike , this handler work is do opposite state of what is present state */}
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />} {/* if like then red Favorite */}
        </Button>

        {/* if i click the comment icon an open Dialog box so, add the onClick fun .     commentToggle initial value false so not !commentToggle mean value is true  so help tp open Dialog box */}
        <Button onClick={() => setCommentToggle(!commentToggle)}>
          <ChatBubbleOutline />
        </Button>

        {isDelete ? (
          <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
      </div>

         {/* Dialog --> this is come from  material ui .  it`s work to open a box .  to open this box i passed likesUser value and close it to passed not !likesUser like this setLikesUser(!likesUser)*/}
      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography variant="h4">Liked By</Typography>

          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url} />
          ))}
        </div>
      </Dialog>

      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>

          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Comment Here..."
              required />

            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>

          {comments.length > 0 ? (
            comments.map((item) => (
              <CommentCard
                userId={item.user._id}
                name={item.user.name}
                avatar={item.user.avatar.url}
                comment={item.comment}
                commentId={item._id}
                key={item._id}
                postId={postId}
                isAccount={isAccount} />
            ))
          ) : (
            <Typography>No comments Yet</Typography>
          )}
        </div>
      </Dialog>


      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update Caption</Typography>

          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required />

            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
