import axios from "axios";

const api = axios.create({
  baseURL:
    "https://684423c1700eac789cad5382--launchpadeventsplatform.netlify.app/",
});

export const getEvents = (searchTerm = "") => {
  const params = {};

  if (searchTerm) {
    params.search = searchTerm;
  }
  return api
    .get(`/events`, { params, withCredentials: true })
    .then(({ data: { events } }) => {
      return events;
    });
};

export const getEvent = (event_id) => {
  return api
    .get(`/events/${event_id}`, {
      withCredentials: true,
    })
    .then(({ data: { event } }) => {
      return event;
    });
};

export const signupUser = (reqBody) => {
  return api
    .post(`/users/signup`, reqBody, {
      withCredentials: true,
    })
    .then(({ data: { user } }) => {
      return user;
    });
};

export const loginUser = (reqBody) => {
  return api
    .post(`/users/login`, reqBody, {
      withCredentials: true,
    })
    .then(({ data: { userData } }) => {
      return userData;
    });
};

export const getUserInfo = () => {
  return api
    .get(`/users/auth/me`, {
      withCredentials: true,
    })
    .then(({ data: { user } }) => {
      return user;
    });
};

export const signUpForEvent = (reqBody) => {
  return api
    .post(`/signups`, reqBody, {
      withCredentials: true,
    })
    .then(({ data: { signup } }) => {
      return signup;
    });
};

export const isUserSignedUpForThisEvent = (user_id, event_id) => {
  return api
    .get(`/users/${user_id}/events/${event_id}/status`, {
      withCredentials: true,
    })
    .then(({ data: { status } }) => {
      return status;
    });
};

export const getEventsUserIsSignedUpTo = (user_id) => {
  return api
    .get(`/users/${user_id}/events`, {
      withCredentials: true,
    })
    .then(({ data: { events } }) => {
      return events;
    });
};

export const getEventsUserCreated = (user_id) => {
  return api
    .get(`/users/${user_id}/created-events`, {
      withCredentials: true,
    })
    .then(({ data: { createdEvents } }) => {
      return createdEvents;
    });
};

export const createEvent = (reqBody) => {
  return api
    .post(`/events`, reqBody, {
      withCredentials: true,
    })
    .then(({ data: { signup } }) => {
      return signup;
    });
};

export const deleteEvent = (eventId) => {
  return api.delete(`/events/${eventId}`, {
    withCredentials: true,
  });
};

export const logout = () => {
  return api.post(`/users/logout`, null, {
    withCredentials: true,
  });
};

export const getEventAttendees = (eventId) => {
  return api
    .get(`/signups/event/${eventId}`, {
      withCredentials: true,
    })
    .then(({ data: { users } }) => {
      return users;
    });
};
