import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// styles
import "./GitHubAuthBtn.styles.scss";

// Auth Configs
import {
  firebaseAuth,
  githubAuthProvider,
} from "../../configs/firebase.config";

// Redux Action
import { authUser, signOut } from "../../Redux/reducer/User/User.action";

const GitHubAuthBtn = () => {
  const [dropDown, setDropDown] = useState(false);

  const reduxState = useSelector(({ user }) => ({ user }));
  const dispatch = useDispatch();

  const githubSignin = async () => {
    try {
      const githubAuth = await firebaseAuth.signInWithPopup(githubAuthProvider);

      const {
        login,
        name,
        html_url,
        avatar_url,
        id,
      } = githubAuth.additionalUserInfo.profile;

      const currentUser = {
        id,
        username: login,
        fullname: name,
        profileUrl: html_url,
        profilePic: avatar_url,
      };
      return await dispatch(authUser(currentUser));
    } catch (error) {
      console.log(error);
    }
  };

  const signOutUser = async () => {
    try {
      await firebaseAuth.signOut();
      return dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return reduxState.user.isAuth ? (
    <>
      <div className="profile__data_container">
        <div className="profile__data" onClick={() => setDropDown(!dropDown)}>
          <h5>{reduxState.user.user.fullname}</h5>
          <img src={reduxState.user.user.profilePic} alt="profile Pic" />
        </div>
        <div className={classnames("profile__dropdown", { hide: !dropDown })}>
          <Link to="/profile">
            <div className="user__profile">
              <h6 className="app-bg-color">Profile</h6>
              <i className="fas fa-user app-bg-color" />
            </div>
          </Link>
          <div className="logout__user" onClick={signOutUser}>
            <h6 className="app-bg-color">Logout</h6>
            <i className="fas fa-sign-out-alt app-bg-color" />
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <button className="btn btn-github" onClick={githubSignin}>
        Sign in with github
        <i className="fab fa-github fa-lg" style={{ marginLeft: ".5rem" }} />
      </button>
    </>
  );
};

export default GitHubAuthBtn;
