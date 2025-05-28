import React, { useEffect, useState } from "react";
import { getEvents } from "../api";

import { useNavigate } from "react-router-dom";

import EventCard from "./EventCard";

const EventSearch = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then((events) => {
        setEvents(events);
        setLoading(false);
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          setError("Network error. Please try again later.");
        }

        if (err.status === 401) {
          navigate("/login");
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Events</h1>
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

export default EventSearch;
