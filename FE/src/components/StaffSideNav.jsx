import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StaffSideNav.module.css";

const StaffSideNav = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.sideNav}>
      <p onClick={() => navigate("/your-events/attending")}>
        Events you are attending
      </p>
      <p onClick={() => navigate("/your-events/organising")}>
        Events you are organising
      </p>
    </div>
  );
};

export default StaffSideNav;
