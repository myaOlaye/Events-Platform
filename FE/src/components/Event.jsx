import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEvent,
  isUserSignedUpForThisEvent,
  signUpForEvent,
  deleteEvent,
} from "../api";
import { formatDate } from "../utilities/formatDate";
import { UserInfoContext } from "../contexts/UserInfoContext";
import styles from "./Event.module.css";
import EventAttendees from "./EventAttendees";

// Simple modal for confirmation
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal} tabIndex="-1" ref={modalRef}>
        <p>{message}</p>
        <div className={styles.modalButtons}>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

const Event = () => {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(UserInfoContext);

  const [event, setEvent] = useState({});
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    event: false,
    signup: false,
    setSignedUp: true,
    deletingEvent: false,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const headingRef = useRef();

  useEffect(() => {
    if (!userInfo.id) {
      navigate("/login");
    }
  }, [userInfo.id]);

  useEffect(() => {
    setLoading((curr) => ({ ...curr, event: true }));
    getEvent(event_id)
      .then((eventData) => {
        setEvent(eventData);
        setLoading((curr) => ({ ...curr, event: false }));
        setTimeout(() => headingRef.current?.focus(), 0);
      })
      .catch((err) => {
        setLoading((curr) => ({ ...curr, event: false }));
        if (err.status === 404) {
          setError("Event Not Found");
        } else if (err.status === 401) {
          navigate("/login");
        } else {
          setError(err.response?.data?.msg || "Unexpected error");
        }
      });
  }, [event_id]);

  useEffect(() => {
    if (userInfo.id) {
      setLoading((curr) => ({ ...curr, setSignedUp: true }));
      isUserSignedUpForThisEvent(userInfo.id, event_id)
        .then(setIsSignedUp)
        .finally(() => setLoading((curr) => ({ ...curr, setSignedUp: false })));
    }
  }, [userInfo.id]);

  const generateGoogleCalendarLink = (event) => {
    const start = new Date(event.date)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(event.date).getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title || "Event"
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      event.description || ""
    )}&location=${encodeURIComponent(event.location || "")}&sf=true&output=xml`;
  };

  const confirmAction = (action) => {
    setModalAction(() => action);
    setShowConfirmModal(true);
  };

  const handleSignUp = () => {
    const reqBody = { user_id: userInfo.id, event_id };
    setLoading((curr) => ({ ...curr, signup: true }));

    signUpForEvent(reqBody)
      .then(() => {
        setStatusMessage("You have successfully signed up for this event.");
        setIsSignedUp(true);
      })
      .catch((err) => {
        if (err.status === 409) {
          setStatusMessage("You are already signed up for this event.");
        } else {
          setStatusMessage("An unexpected error occurred. Please try again.");
        }
      })
      .finally(() => {
        setLoading((curr) => ({ ...curr, signup: false }));
      });
  };

  const handleDelete = () => {
    setLoading((curr) => ({ ...curr, deletingEvent: true }));
    deleteEvent(event.id)
      .then(() => {
        setStatusMessage("You have successfully deleted this event.");
        navigate("/");
      })
      .catch((err) => {
        if (err.status === 403) {
          setStatusMessage("You do not have permission to delete this event.");
        } else {
          setStatusMessage("An unexpected error occurred. Please try again.");
        }
      })
      .finally(() => {
        setLoading((curr) => ({ ...curr, deletingEvent: false }));
      });
  };

  return (
    <div className={styles.container}>
      <ConfirmModal
        isOpen={showConfirmModal}
        message="Are you sure you want to proceed? This action cannot be undone."
        onConfirm={() => {
          setShowConfirmModal(false);
          modalAction?.();
        }}
        onCancel={() => setShowConfirmModal(false)}
      />

      {error ? (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      ) : loading.event ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <>
          <h1
            className={styles.title}
            tabIndex="-1"
            ref={headingRef}
            id="event-title"
          >
            {event.title}
          </h1>
          <img
            src={event.image_url}
            className={styles.eventImage}
            alt={`Image for event titled ${event.title}`}
          />
          <h2 className={styles.sectionHeading}>Event Details</h2>
          <p className={styles.location}>{event.location}</p>
          <p className={styles.date}>{formatDate(event.date)}</p>
          <p className={styles.description}>{event.description}</p>

          {statusMessage && (
            <p role="status" aria-live="polite" className={styles.status}>
              {statusMessage}
            </p>
          )}

          {userInfo.id === event.created_by ? (
            <div className={styles.eventCreatorInfo}>
              <a
                href={generateGoogleCalendarLink(event)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.googleCalButton}
              >
                Add this event to your Google Calendar
              </a>
              <EventAttendees eventId={event.id} />
              <button
                className={styles.deleteButton}
                onClick={() => confirmAction(handleDelete)}
                aria-label={`Delete event titled ${event.title}`}
              >
                Delete Event
              </button>
            </div>
          ) : loading.setSignedUp ? null : isSignedUp ? (
            <a
              href={generateGoogleCalendarLink(event)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.googleCalButton}
            >
              You are signed up. Add to Google Calendar
            </a>
          ) : loading.signup ? (
            <p className={styles.loading}>Signing you up...</p>
          ) : (
            <button
              className={styles.signupButton}
              onClick={() => confirmAction(handleSignUp)}
              aria-label={`Sign up for event titled ${event.title}`}
            >
              Sign Up for This Event
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Event;
