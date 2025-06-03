import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { formatName } from "../utilities/formatName";
import { logout } from "../api";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
      {userInfo.firstName && (
        <p>Welcome back, {formatName(userInfo.firstName)}</p>
      )}
      {userInfo.id && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            className={styles.dropdownToggle}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            Menu ▼
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
    </header>
  );
};

export default Header;
