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
          if (err.response?.status === 500) {
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
    <>
      <a href="#mainContent" className={styles.srOnlyFocusable}>
        Skip to main content
      </a>

      <div className={styles.pageContainer}>
        {userInfo.role === "staff" && <StaffSideNav />}

        <main
          id="mainContent"
          className={styles.content}
          tabIndex={-1}
          aria-live="polite"
          aria-busy={loading}
        >
          <h2 className={styles.eventHeading}>Events you signed up for</h2>

          {error ? (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          ) : loading ? (
            <p className={styles.loading}>Loading events...</p>
          ) : (
            <>
              {events.length === 0 && (
                <p>
                  You are not signed up to any events.{" "}
                  <Link to="/" className={styles.link}>
                    Click here to browse events.
                  </Link>
                </p>
              )}

              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default YourEvents;
