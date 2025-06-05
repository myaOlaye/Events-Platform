import React, { useContext, useEffect, useState } from "react";
import { getEvents } from "../api";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { IoSearch } from "react-icons/io5";
import styles from "./EventSearch.module.css";

const EventSearch = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { setUserInfo } = useContext(UserInfoContext);

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
          setUserInfo({});
          navigate("/login");
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    getEvents(searchInput)
      .then((events) => {
        console.log(events, "events in handle search");
        setEvents(events);
        setLoading(false);
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          setError("Network error. Please try again later.");
        }
        if (err.status === 401) {
        }
        setLoading(false);
      });
  };

  return (
    <>
      <h1>Events</h1>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search events"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <button className={styles.searchButton} type="submit">
          <IoSearch size={22} />
        </button>
      </form>
      {error ? (
        <p>{error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : events.length > 0 ? (
        events.map((event) => {
          return <EventCard key={event.id} event={event}></EventCard>;
        })
      ) : (
        <p>No events matched your search </p>
      )}
    </>
  );
};

export default EventSearch;
