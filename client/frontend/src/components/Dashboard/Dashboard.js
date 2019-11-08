import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import GroupCard from "./GroupCard/GroupCard";
import AddGroup from "./Add Group/AddGroup";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [deletedGroup, setDeletedGroup] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("/api/groups/all-user-groups", config);
      let groupsData = response.data.data.groups;
      console.log("GROUPS FETCHED");
      setGroups([...groupsData]);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const deleteGroup = async id => {
    await axios.delete(`/api/groups/${id}`, config);
  };

  useEffect(() => {
    if (token) fetchGroups();
  }, []);

  useEffect(() => {
    if (token && newGroup) {
      console.log("NEW GROUP CHANGED");
      // TODO - if state has updated, do this
      fetchGroups();
    }
  }, [newGroup]);

  useEffect(() => {
    if (token && deletedGroup) {
      const id = deletedGroup;
      setDeletedGroup("");

      console.log("GROUP DELETED");
      deleteGroup(id);
      fetchGroups();
      setNewGroup(id);
    }
  }, [deletedGroup]);

  const deleteGroupHandler = groupId => {
    setDeletedGroup(groupId);
  };

  // const newGroupHandler = newGroup => {
  //   setGroups(prevGroups => prevGroups.concat(newGroup));
  // };

  // TODO - Show the user's group's lists
  // useEffect(() => {
  //   const fetchLists = async groupId => {
  //     const response = await axios.get(`/api/lists/${groupId}/`, config);
  //     const listArray = response.data.data.lists;
  //     console.log(listArray);
  //     setLists([...listArray]);
  //   };
  //   if (token && groups) {
  //     groups.map(group => {
  //       return fetchLists(group._id);
  //     });
  //   }
  // }, [groups]);

  // Set the title depending on if the user is logged in or not
  let title = token ? (
    <div>
      <h2>Your Groups</h2>
    </div>
  ) : (
    <h2>You need to be logged in to access the dashboard</h2>
  );

  // Create array to allow React to render the groups to the page
  let renderGroups = groups.map(group => (
    <GroupCard
      key={group._id}
      group={group}
      deleteGroup={deleteGroupHandler}
      config={config}
    />
  ));

  let renderErrorMessage = "";
  if (errorMessage) {
    renderErrorMessage = <p>{errorMessage}</p>;
  }

  return (
    <div>
      {title}
      {renderErrorMessage}
      <AddGroup token={token} config={config} />
      <ul>{renderGroups}</ul>
      <input
        onChange={() => console.log(groups, newGroup, deletedGroup)}
        type="text"
        name="text"
      ></input>
    </div>
  );
};

export default withRouter(Dashboard);
