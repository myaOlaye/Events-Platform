import "./App.css";
import EventSearch from "./components/eventSearch";
import Event from "./components/Event";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { UserInfoContext } from "./contexts/UserInfoContext";
import { getUserInfo } from "./api";
import { Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import Header from "./components/Header";
import YourEvents from "./components/YourEvents";
import UserOrganisedEvents from "./components/UserOrganisedEvents";
import CreateEvent from "./components/CreateEvent";

function App() {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);

  useEffect(() => {
    getUserInfo()
      .then(({ id, first_name, last_name, role, email }) => {
        setUserInfo({
          id,
          email,
          firstName: first_name,
          lastName: last_name,
          role,
        });
      })
      .catch((err) => {
        console.log(err);
        setUserInfo({});
      });
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/*"
          element={<p>Theres nothing here. Soon to be Error page</p>}
        ></Route>
        <Route path="/bad-request" element={<p>400 Bad Request</p>}></Route>
        <Route
          path="/unauthorised"
          element={<p>You are not authorised to view this page</p>}
        ></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<EventSearch />}></Route>
        <Route path="/event/:event_id" element={<Event />}></Route>
        <Route path="/your-events/attending" element={<YourEvents />}></Route>
        <Route
          path="/your-events/organising"
          element={<UserOrganisedEvents />}
        ></Route>
        <Route path="/create-event" element={<CreateEvent />}></Route>
      </Routes>
    </>
  );
}

export default App;
