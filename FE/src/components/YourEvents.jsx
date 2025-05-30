import React, { useEffect, useState, useContext } from "react";
import { getEventsUserIsSignedUpTo } from "../api";
import { UserInfoContext } from "../contexts/UserInfoContext";
import EventCard from "./EventCard";
import StaffSideNav from "./StaffSideNav";
import { useNavigate } from "react-router-dom";
import styles from "./YourEvents.module.css";

const YourEvents = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // the problem with this is that if userInfo.id is undefined
    // the below never runs and we never hit the navigate to login
    // need to have a fix for this, potentially with userLoading in userinfo contect
    if (userInfo.id) {
      setLoading(true);
      getEventsUserIsSignedUpTo(userInfo.id)
        .then((events) => {
          setEvents(events);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 500) {
            setError("Failed to fetch events. Please try again later.");
          } else if (err.status === 401) {
            navigate("/login");
          } else {
            setError(
              err.response?.data?.msg || "An unexpected error occurred."
            );
          }
          setLoading(false);
        });
    }
  }, [userInfo.id]);

  return (
    <div className={styles.pageContainer}>
      {userInfo.role === "staff" && <StaffSideNav />}
      <div className={styles.content}>
        <h2 className={styles.eventHeading}>Events you are signed up for</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          events.map((event) => {
            return <EventCard key={event.id} event={event}></EventCard>;
          })
        )}
      </div>
    </div>
  );
};

export default YourEvents;
