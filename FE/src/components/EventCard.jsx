import React from "react";
import { formatDate } from "../utilities/formatDate";
import { useNavigate, Link } from "react-router-dom";

const EventCard = ({
  event: { title, description, location, date, image_url, id },
}) => {
  const navigate = useNavigate();

  return (
    <Link to={`/event/${id}`}>
      <div>
        <h2>{title}</h2>
        <p>{location}</p>
        <p>{description}</p>
        <p>{formatDate(date)}</p>
        <img src={image_url} alt="" />
        {/*  change be to have actual img urls */}
      </div>
    </Link>
  );
};

export default EventCard;
