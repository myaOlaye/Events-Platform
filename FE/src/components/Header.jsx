import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { formatName } from "../utilities/formatName";
import { logout } from "../api";
import { IoMenu } from "react-icons/io5";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout().then(() => {
      alert("Logged out!");
      setUserInfo({});
      navigate("/login");
    });
  };

  return (
    <header className={styles.header} role="banner">
      <div
        className={styles.logo}
        onClick={() => navigate("/")}
        aria-label="Go to homepage"
      >
        EventsPlatform
      </div>

      <div className={styles.headerRight}>
        {userInfo.firstName && (
          <p className={styles.welcomeMessage}>
            Welcome back, {formatName(userInfo.firstName)}
          </p>
        )}

        {userInfo.id && (
          <div className={styles.dropdown} ref={dropdownRef}>
            <button
              className={styles.dropdownToggle}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="User menu"
              type="button"
            >
              <IoMenu className={styles.menuIcon} size={24} />
            </button>

            {dropdownOpen && (
              <ul
                className={styles.dropdownMenu}
                role="menu"
                aria-label="User options menu"
              >
                <li role="none">
                  <button
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate("/")}
                    type="button"
                  >
                    Find Events
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() => handleNavigate("/your-events/attending")}
                    type="button"
                  >
                    Your Events
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                    type="button"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
