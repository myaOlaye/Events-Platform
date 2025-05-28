import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent } from "../api";
import { formatDate } from "../utilities/formatDate";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { isUserSignedUpForThisEvent } from "../api";
import { signUpForEvent } from "../api";

const Event = () => {
  const { event_id } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    event: false,
    signup: false,
    setSignedUp: true,
  });
  const [event, setEvent] = useState({});
  const [isSignedUp, setIsSignedUp] = useState(false);
  const { userInfo } = useContext(UserInfoContext);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading((currLoading) => {
      return { ...currLoading, event: true };
    });
    getEvent(event_id)
      .then((event) => {
        setEvent(event);
        setLoading((currLoading) => {
          return { ...currLoading, event: false };
        });
      })
      .catch((err) => {
        setLoading((currLoading) => {
          return { ...currLoading, event: false };
        });
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

  useEffect(() => {
    if (userInfo.id) {
      setLoading((currLoading) => {
        return { ...currLoading, setSignedUp: true };
      });
      isUserSignedUpForThisEvent(userInfo.id, event_id)
        .then((status) => {
          setIsSignedUp(status);
        })
        .finally(() => {
          setLoading((currLoading) => {
            return { ...currLoading, setSignedUp: false };
          });
        });
    }
  }, [userInfo.id]);

  const handleClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to sign up for this event?"
    );
    if (!confirmed) return;
    const reqBody = { user_id: userInfo.id, event_id };

    setLoading((currLoading) => {
      return { ...currLoading, signup: true };
    });
    signUpForEvent(reqBody)
      .then(() => {
        alert("You have succesfully signed up for this event");
        setIsSignedUp(true);
        setLoading((currLoading) => {
          return { ...currLoading, signup: false };
        });
      })
      .catch((err) => {
        setLoading((currLoading) => {
          return { ...currLoading, signup: false };
        });
        if (err.status === 409) {
          alert("You are already signed up for this event.");
        } else {
          console.error(err);
          alert("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : loading.event ? (
        <p>loading ...</p>
      ) : (
        <>
          <h1>{event.title}</h1>
          <p>{event.location}</p>
          <p>{event.description}</p>
          <p>{formatDate(event.date)}</p>
          <img src={event.image_url} alt="" />
          {/*  change be to have actual img urls */}
          {userInfo.id && loading.setSignedUp ? (
            <></>
          ) : isSignedUp ? (
            <p>
              You are signed up to this event. Click here to add to your google
              calendar.
            </p>
          ) : loading.signup ? (
            <p>Signup Loading...</p>
          ) : (
            <button onClick={handleClick}>Sign Up for This Event</button>
          )}
        </>
      )}
    </div>
  );
};

export default Event;
