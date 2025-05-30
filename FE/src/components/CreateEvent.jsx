import React from "react";
import { useEffect, useContext } from "react";
import { UserInfoContext } from "../contexts/UserInfoContext";

const CreateEvent = () => {
  const { userInfo } = useContext(UserInfoContext);

  useEffect(() => {
    if (userInfo.role)
      if (userInfo.role !== "staff") {
        return navigate("/unauthorised");
      }
  }, [userInfo.role]);

  return <div>CreateEvent</div>;
};

export default CreateEvent;
