import React, { useState } from "react";
import axios from "axios";

import "./AddMember.css";

const AddMember = props => {
  const [show, setShow] = useState();
  const [newMember, setNewMember] = useState("");

  const addMemberHandler = async token => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`
      }
    };
    const body = {
      email: newMember
    };
    try {
      // /api/groups/:group_id
      const res = await axios.post(
        `/api/groups/${props.group._id}`,
        body,
        config
      );
      props.addMember(res.data.data.user);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  let content = null;
  if (show)
    content = (
      <div className="add-member__input">
        <input
          value={newMember}
          onChange={e => setNewMember(e.target.value)}
          className="add-member__name"
          type="text"
          placeholder="Enter a user's email"
        />
        <button
          className="add-member__submit"
          type="button"
          onClick={() => addMemberHandler(props.token)}
        >
          Add Member
        </button>
        <span
          className="add-member__cancel"
          onClick={() => setShow(false)}
          onKeyDown={() => setShow(false)}
          role="button"
        >
          Cancel
        </span>
      </div>
    );

  let addMemberText = null;
  if (!show) {
    addMemberText = (
      <div>
        <span className="add-member__plus add-element">+</span>
        <span
          className="add-member__text add-element"
          onClick={() => setShow(!show)}
          onKeyDown={() => setShow(!show)}
          role="button"
        >
          Add Member
        </span>
      </div>
    );
  }

  return (
    <div>
      {content}
      {addMemberText}
    </div>
  );
};

export default AddMember;
