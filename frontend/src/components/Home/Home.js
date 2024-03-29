import { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import Posts from "../Posts/Posts";
import Profile from "../Profile/Profile";
import Followers from "../Followers/Followers";

import { useDispatch, useSelector } from "react-redux";
import { logout, selector } from "../../redux/reduxSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(null);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollY = useRef(0);
  const middleContainerRef = useRef(null);
  const { user } = useSelector(selector);

  useEffect(() => {
    // Attach event listeners to the middle container
    const middleContainer = middleContainerRef.current;
    console.log(middleContainer);
    const handleScroll = () => {
      const currentScrollY = middleContainer.scrollTop;

      const isScrollingUp = currentScrollY < prevScrollY.current;
      prevScrollY.current = currentScrollY;
      isScrollingUp ? console.log("scroll up") : console.log("scroll down");

      // Show/hide the sidebar based on scrolling direction
      if (isScrollingUp !== isVisible) {
        console.log("scroll up");
        setIsVisible(isScrollingUp);
      }
    };

    middleContainer.addEventListener("scroll", handleScroll);
    middleContainer.addEventListener("touchmove", handleScroll);

    return () => {
      middleContainer.removeEventListener("scroll", handleScroll);
      middleContainer.removeEventListener("touchmove", handleScroll);
    };
  }, [isScrollingUp, isVisible]);

  return (
    <div className={styles.main}>
      {/* left side navigation bar */}
      <section
        className={`${styles.leftSidebar} ${isVisible ? "" : styles.hidden}`}
      >
        <div
          className={styles.navListItem}
          onClick={() => {
            setPage(<Posts temp="joo" setPage={setPage} Profile={Profile} />);
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/home.png"
            alt="home"
          />
          <span>Home</span>
          <span className={styles.hiddenText}>Home</span>
        </div>
        <div
          className={styles.navListItem}
          onClick={() => {
            setPage(<Profile />);
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/user--v1.png"
            alt="profile"
          />
          <span>Profile</span>
          <span className={styles.hiddenText}>profile</span>
        </div>
        <div
          className={styles.navListItem}
          onClick={() => {
            setPage(<Followers />);
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/add-administrator.png"
            alt="Followers"
          />
          <span>Followers</span>
          <span className={styles.hiddenText}>Followers</span>
        </div>
        <div className={styles.navListItem}>
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/message-group.png"
            alt="Messages"
          />
          <span>Messages</span>
          <span className={styles.hiddenText}>Messages</span>
        </div>
        {/* login and logout buttons */}
        {user ? (
          <div
            className={styles.navListItem}
            onClick={() => dispatch(logout())}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/logout-rounded-left.png"
              alt="Logout"
            />
            <span>Logout</span>
            <span className={styles.hiddenText}>Logout</span>{" "}
          </div>
        ) : (
          <div
            className={styles.navListItem}
            onClick={() => navigate("/login")}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/login-rounded-right.png"
              alt="Login"
            />
            <span>Login</span>
            <span className={styles.hiddenText}>Login</span>
          </div>
        )}
        {/* <div
          className={`${styles.postButton} ${styles.navListItem}`}
          onClick={(e) => {
            setModal(!modal);
          }}
        >
          Post
        </div> */}
      </section>

      {/* middle container */}
      <div ref={middleContainerRef} className={styles.middleContainer}>
        {page || <Posts setPage={setPage} Profile={Profile} />}
      </div>

      {/* right side bar */}
      <div className={styles.rightSidebar}></div>
    </div>
  );
};

export default Home;
