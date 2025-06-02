import React from "react";
import { useContext, useState, useEffect } from "react";
import { useFormAction, useNavigate, Link } from "react-router-dom";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { getEvent, getEventsUserCreated } from "../api";
import StaffSideNav from "./StaffSideNav";

const UserOrganisedEvents = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.id) {
      navigate("/");
    }
  }, [userInfo.id, navigate]);

  useEffect(() => {
    if (userInfo.role)
      if (userInfo.role !== "staff") {
        return navigate("/unauthorised");
      }
  }, [userInfo.role]);

  useEffect(() => {
    if (userInfo.id) {
      setLoading(true);
      getEventsUserCreated(userInfo.id)
        .then((events) => {
          setEvents(events);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 500) {
            setError("Failed to fetch events. Please try again later.");
          } else if (err.status === 401) {
            //probs redundant cause this wouldnt run if there is no valid credientioals
            navigate("/login");
          } else {
            setError(
              err.response?.data?.msg || "An unexpected error occurred."
            );
          }
          setLoading(false);
        });
    }
  }, [userInfo.id]);

  return (
    <>
      {userInfo.role && userInfo.role === "staff" && (
        <div className="container">
          <div className="sideNavWrapper">
            <StaffSideNav />
          </div>
          <main className="content">
            <h2>Events you are organising</h2>
            {error ? (
              <p>{error}</p>
            ) : loading ? (
              <p>Loading...</p>
            ) : events ? (
              <>
                <button>+ Create a new event</button>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </>
            ) : (
              <>
                <p>You have not organised any events yet</p>
                <Link to="/create-event">
                  <button>+ Create a new event</button>
                </Link>
              </>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default UserOrganisedEvents;
