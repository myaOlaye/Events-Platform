import React, { useState, useEffect } from "react";
import { getEventAttendees } from "../api";
import styles from "./EventAttendees.module.css";

const EventAttendees = ({ eventId }) => {
  const [eventAttendees, setEventAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleAttendees = showAll
    ? filteredAttendees
    : filteredAttendees.slice(0, 10);

  useEffect(() => {
    setLoading(true);
    getEventAttendees(eventId)
      .then((users) => {
        setLoading(false);
        setEventAttendees(users);
        setFilteredAttendees(users);
      })
      .catch(() => {
        setLoading(false);
        setError("Problem loading event attendees.");
      });
  }, [eventId]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = eventAttendees.filter((attendee) =>
      `${attendee.first_name} ${attendee.last_name}`
        .toLowerCase()
        .includes(term)
    );
    setFilteredAttendees(filtered);
  }, [searchTerm, eventAttendees]);

  return (
    <div className={styles.container}>
      <div className={styles.attendeeInfo}>
        <h2 className={styles.heading} id="attendee-heading">
          Event Attendees
        </h2>
        <p className={styles.attendeeCount} aria-describedby="attendee-heading">
          {eventAttendees.length} total
        </p>
      </div>

      <label htmlFor="attendee-search" className="visually-hidden">
        Search attendees by name
      </label>
      <input
        type="text"
        id="attendee-search"
        placeholder="Search by name"
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div role="status" aria-live="polite" className={styles.messageContainer}>
        {loading && <p className={styles.message}>Loading...</p>}
        {error && <p className={styles.message}>{error}</p>}
      </div>

      <ul className={styles.attendeeList} aria-label="List of event attendees">
        {visibleAttendees.map((attendee) => (
          <li key={attendee.id} className={styles.attendee}>
            {attendee.first_name} {attendee.last_name}
          </li>
        ))}
        {!loading && filteredAttendees.length === 0 && (
          <li className={styles.message}>
            No one is signed up for this event.
          </li>
        )}
      </ul>

      {filteredAttendees.length > 10 && (
        <button
          className={styles.toggleButton}
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          aria-controls="attendee-list"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default EventAttendees;
