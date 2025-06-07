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
        setEvents(events);
        setLoading(false);
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          setError("Network error. Please try again later.");
        }
        setLoading(false);
      });
  };

  return (
    <>
      <h1 className={styles.header}>Find an Event</h1>

      <form
        onSubmit={handleSubmit}
        className={styles.searchForm}
        role="search"
        aria-label="Event search form"
      >
        <label htmlFor="eventSearch" className={styles.visuallyHidden}>
          Search events
        </label>
        <input
          id="eventSearch"
          className={styles.searchInput}
          type="text"
          placeholder="Search events"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-describedby="searchHelp"
        />
        <button
          className={styles.searchButton}
          type="submit"
          aria-label="Search events"
        >
          <IoSearch size={28} />
        </button>
      </form>

      <div id="searchHelp" className={styles.visuallyHidden}>
        Type your search query and press Enter or click the search button
      </div>

      {error ? (
        <p role="alert" className={styles.errorMessage}>
          {error}
        </p>
      ) : loading ? (
        <p role="alert" className={styles.loadingMessage}>
          Loading...
        </p>
      ) : events.length > 0 ? (
        <section aria-live="polite" aria-atomic="true">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      ) : (
        <p role="status" aria-live="polite">
          No events matched your search
        </p>
      )}
    </>
  );
};

export default EventSearch;
