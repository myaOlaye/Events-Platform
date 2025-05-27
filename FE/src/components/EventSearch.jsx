import React, { useEffect, useState } from "react";
import { getEvents } from "../api";

const EventSearch = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((events) => {
      console.log(events);
    });
  }, []);

  return <div>EventSearch</div>;
};

export default EventSearch;
