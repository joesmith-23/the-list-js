import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import GroupCard from "./GroupCard/GroupCard";
import SideBarMenu from "./SideBarMenu";
import "./Dashboard.css";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [deletedGroup, setDeletedGroup] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("");

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

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("/api/users/me", config);
      let user = response.data.data.user;
      console.log("USER FETCHED");
      setCurrentUser(user);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const deleteGroup = async id => {
    await axios.delete(`/api/groups/${id}`, config);
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
      fetchCurrentUser();
    }
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
      currentUser={currentUser}
    />
  ));

  let renderErrorMessage = "";
  if (errorMessage) {
    renderErrorMessage = <p>{errorMessage}</p>;
  }

  return (
    <div>
      <div className="groups-content__container">
        <SideBarMenu
          groups={groups}
          token={token}
          config={config}
          title={title}
          renderErrorMessage={renderErrorMessage}
        />
        <div className="groups__wrapper">
          <ul className="groups-list__wrapper">{renderGroups}</ul>
        </div>
        {/* <input
          onChange={() => console.log(groups, currentUser)}
          type="text"
          name="text"
        ></input> */}
      </div>
    </div>
  );
};

export default withRouter(Dashboard);
