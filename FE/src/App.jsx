import "./App.css";
import EventSearch from "./components/eventSearch";
import Event from "./components/Event";
import Signup from "./components/Signup";
import Login from "./components/Login";

import { Routes, Route } from "react-router-dom";

function App() {
  // fetch user detail - if dont have go to login page

  return (
    <>
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/*" element={<ErrorPage path={"path"} />}></Route> */}
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<EventSearch />}></Route>
        <Route path="/event/:event_id" element={<Event />}></Route>
      </Routes>
    </>
  );
}

export default App;
