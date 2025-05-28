import React, { useEffect, useState, useContext } from "react";
import { getEventsUserIsSignedUpTo } from "../api";
import { UserInfoContext } from "../contexts/UserInfoContext";
import EventCard from "./EventCard";

const YourEvents = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userInfo.id) {
      setLoading(true);
      getEventsUserIsSignedUpTo(userInfo.id)
        .then((events) => {
          setEvents(events);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          if (err.response.status === 500) {
            setError("Failed to fetch events. Please try again later.");
          } else {
            setError(
              err.response?.data?.msg || "An unexpected error occurred."
            );
          }
        });
    }
  }, [userInfo.id]);

  return (
    <>
      <h2>Events you are signed up for</h2>
      {error ? (
        <p>{error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        events.map((event) => {
          return <EventCard key={event.id} event={event}></EventCard>;
        })
      )}
    </>
  );
};

export default YourEvents;
