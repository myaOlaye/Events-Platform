import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { getEventsUserCreated } from "../api";
import StaffSideNav from "./StaffSideNav";
import EventCard from "./EventCard";
import styles from "./UserOrganisedEvents.module.css";

const UserOrganisedEvents = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.id) {
      navigate("/");
    }
  }, [userInfo.id, navigate]);

  useEffect(() => {
    if (userInfo.role && userInfo.role !== "staff") {
      navigate("/unauthorised");
    }
  }, [userInfo.role, navigate]);

  useEffect(() => {
    if (userInfo.id) {
      setLoading(true);
      getEventsUserCreated(userInfo.id)
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
  }, [userInfo.id, navigate]);

  return (
    <>
      <a
        href="#mainContent"
        className={`${styles.srOnly} ${styles.srOnlyFocusable}`}
      >
        Skip to main content
      </a>

      {userInfo.role === "staff" && (
        <div className={styles.container}>
          <div className={styles.navWrapper}>
            <StaffSideNav />
          </div>

          <div className={styles.contentWrapper}>
            <main
              id="mainContent"
              className={styles.content}
              tabIndex={-1}
              aria-live="polite"
              aria-busy={loading}
            >
              <h1>Events you are organising</h1>

              {error && (
                <p role="alert" className={styles.error}>
                  {error}
                </p>
              )}

              {loading && <p>Loading events...</p>}

              {!loading && !error && (
                <>
                  <Link to="/create-event">
                    <button
                      type="button"
                      className={styles.createButton}
                      aria-label="Create a new event"
                    >
                      + Create new event
                    </button>
                  </Link>

                  {events.length > 0 ? (
                    events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p>
                      You have not posted any events yet. Click the button above
                      to create your first one.
                    </p>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default UserOrganisedEvents;
