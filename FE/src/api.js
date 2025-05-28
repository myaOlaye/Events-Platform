import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090/api",
});

export const getEvents = () => {
  return api
    .get(`/events`, {
      withCredentials: true,
    })
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
    .then(({ data }) => {
      return data;
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
