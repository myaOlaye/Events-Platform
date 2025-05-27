import "./App.css";
import EventSearch from "./components/eventSearch";
import Signup from "./components/Signup";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/*" element={<ErrorPage path={"path"} />}></Route> */}
        <Route path="/" element={<Signup />}></Route>
      </Routes>
    </>
  );
}

export default App;
