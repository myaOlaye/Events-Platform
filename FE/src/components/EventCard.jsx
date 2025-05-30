import React from "react";
import { formatDate } from "../utilities/formatDate";
import { useNavigate, Link } from "react-router-dom";
import styles from "./EventCard.module.css";

const EventCard = ({
  event: { title, description, location, date, image_url, id },
}) => {
  const navigate = useNavigate();

  return (
    <Link to={`/event/${id}`} className={styles.link}>
      <div className={styles.card}>
        <img src={image_url} alt={title} className={styles.eventImage} />
        <div className={styles.cardContent}>
          <h2>{title}</h2>
          <p className={styles.location}>{location}</p>
          <p className={styles.description}>{description}</p>
          <p className={styles.date}>{formatDate(date)}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
