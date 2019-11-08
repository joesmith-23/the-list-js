import React, { useState } from "react";
import axios from "axios";

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
      <div className="add-project__input">
        <input
          value={newMember}
          onChange={e => setNewMember(e.target.value)}
          className="add-project__name"
          type="text"
          placeholder="Enter a user's email"
        />
        <button
          className="add-project__submit"
          type="button"
          onClick={() => addMemberHandler(props.token)}
        >
          Add Member
        </button>
        <span
          className="add-project__cancel"
          onClick={() => setShow(false)}
          onKeyDown={() => setShow(false)}
          role="button"
        >
          Cancel
        </span>
      </div>
    );
  return (
    <div>
      {content}
      <span className="add-project__plus add-element">+</span>
      <span
        className="add-project__text add-element"
        onClick={() => setShow(!show)}
        onKeyDown={() => setShow(!show)}
        role="button"
      >
        Add Member
      </span>
    </div>
  );
};

export default AddMember;
