import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { formatName } from "../utilities/formatName";

const Header = () => {
  const { userInfo } = useContext(UserInfoContext);
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
    // TODO: Add your logout logic here (e.g., clear auth tokens/context)
    alert("Logged out!");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        EventsPlatform
      </div>
      {userInfo.firstName && (
        <p>Welcome back, {formatName(userInfo.firstName)}</p>
      )}
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
              onClick={() => handleNavigate("/your-events")}
            >
              Your Events
            </li>
            <li className={styles.dropdownItem} onClick={handleLogout}>
              Log Out
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
