import React, { useEffect, useState, useContext } from "react";
import { getEvents } from "../api";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../api";
import EventCard from "./EventCard";

const EventSearch = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo()
      .then(({ id, first_name, last_name, role, email }) => {
        setUserInfo({
          id,
          email,
          fristName: first_name,
          lastName: last_name,
          role,
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login");
        }
      });
  }, []);

  useEffect(() => {
    getEvents()
      .then((events) => {
        setEvents(events);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>Events</h1>
      {events.map((event) => {
        return <EventCard key={event.id} event={event}></EventCard>;
      })}
    </>
  );
};

export default EventSearch;
