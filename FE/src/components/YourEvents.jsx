import React, { useEffect, useState, useContext } from "react";
import { getEventsUserIsSignedUpTo } from "../api";
import { UserInfoContext } from "../contexts/UserInfoContext";
import EventCard from "./EventCard";
import StaffSideNav from "./StaffSideNav";
import { useNavigate, Link } from "react-router-dom";
import styles from "./YourEvents.module.css";

const YourEvents = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.id) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
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
            //probs redundant cause this wouldnt run if there is no valid credientioals
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
        <h2 className={styles.eventHeading}>Events you signed up for</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <>
            {events.length === 0 && (
              <p>
                You are not signed up to any events.{" "}
                <Link to="/">Click here to browse events.</Link>
              </p>
            )}
            {events.map((event) => {
              return <EventCard key={event.id} event={event}></EventCard>;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default YourEvents;
