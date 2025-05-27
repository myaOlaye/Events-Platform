import "./App.css";
import EventSearch from "./components/eventSearch";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/*" element={<ErrorPage path={"path"} />}></Route> */}
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<EventSearch />}></Route>
      </Routes>
    </>
  );
}

export default App;
