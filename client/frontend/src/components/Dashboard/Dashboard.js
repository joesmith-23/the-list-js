import React, { useState, useEffect } from "react";
import axios from "axios";

import GroupCard from "./GroupCard/GroupCard";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await axios.get("/api/groups/all-user-groups", config);
      let groupsData = response.data.data.groups;
      setGroups([...groupsData]);
    };
    if (token) fetchGroups();
  }, []);

  // Set the title depending on if the user is logged in or not
  let title = token ? (
    <h2>Your Groups</h2>
  ) : (
    <h2>You need to be logged in to access the dashboard</h2>
  );

  // Render the groups to the page
  let renderGroups = groups.map(group => (
    <GroupCard key={group._id} group={group} />
  ));

  return (
    <div>
      {title}
      <ul>{renderGroups}</ul>
      <input
        onChange={() => console.log(groups)}
        type="text"
        name="text"
      ></input>
    </div>
  );
};

export default Dashboard;
