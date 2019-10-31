import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [groups, setGroups] = useState({ groups: [] });
  const [renderedGroups, setRenderedGroups] = useState([]);

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        '/api/groups/all-user-groups-owned',
        config
      );
      let groups = response.data.data.groups;
      setGroups(groups);
      let renderGroups = groups.map(group => (
        <li key={group._id}>{group.name}</li>
      ));
      setRenderedGroups(renderGroups);
    };
    if (token) fetchData();
  }, []);

  let header = token ? (
    <h2>Your Groups</h2>
  ) : (
    <h2>You need to be logged in to access the dashboard</h2>
  );
  return (
    <div>
      {header}
      <ul>{renderedGroups}</ul>
    </div>
  );
};

export default Dashboard;
