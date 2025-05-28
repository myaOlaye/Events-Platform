import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent } from "../api";

const Event = () => {
  const { event_id } = useParams();
  const [error, setError] = useState("");
  const [event, setEvent] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getEvent(event_id)
      .then((event) => {
        setEvent(event);
      })
      .catch((err) => {
        if (err.status === 404) {
          setError("Event Not Found");
        } else {
          if (err.status === 401) {
            navigate("/login");
          }
          setError(`${err.response.data.msg}`);
        }
      });
  }, [event_id]);

  const handleClick = () => {};

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.location}</p>
      <p>{event.description}</p>
      <p>{event.date}</p>
      <img src={event.image_url} alt="" />
      {/*  change be to have actual img urls */}
      <button onClick={handleClick}>Sign Up for This Event</button>
    </div>
  );
};

export default Event;
