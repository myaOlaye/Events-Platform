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

function App() {
  const { setUserInfo } = useContext(UserInfoContext);

  useEffect(() => {
    getUserInfo()
      .then(({ id, first_name, last_name, role, email }) => {
        console.log("inside setuserInfo");
        setUserInfo({
          id,
          email,
          fristName: first_name,
          lastName: last_name,
          role,
        });
      })
      .catch((err) => {
        setUserInfo({});
      });
  }, []);

  return (
    <>
      <Header />
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
