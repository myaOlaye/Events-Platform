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
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
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
            >
              <IoMenu className={styles.menuIcon} size={24} />
            </button>
            {dropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li
                  className={styles.dropdownItem}
                  onClick={() => handleNavigate("/")}
                >
                  Find Events
                </li>
                <li
                  className={styles.dropdownItem}
                  onClick={() => handleNavigate("/your-events/attending")}
                >
                  Your Events
                </li>
                <li className={styles.dropdownItem} onClick={handleLogout}>
                  Log Out
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
