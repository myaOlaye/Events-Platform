import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./StaffSideNav.module.css";

const StaffSideNav = () => {
  return (
    <nav className={styles.nav} aria-label="Staff navigation">
      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/your-events/attending"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Events you signed up for
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/your-events/organising"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Events you are organising
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default StaffSideNav;
