import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const AddGroup = props => {
  const [show, setShow] = useState();
  const [groupName, setGroupName] = useState("");

  const addGroupHandler = async () => {
    const body = {
      name: groupName
    };
    const res = await axios.post("/api/groups/", body, props.config);
    // TODO - Maybe come up with a better way of doing this
    window.location.reload();
  };

  let content = null;
  if (show)
    content = (
      <div className="add-project__input">
        <input
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          className="add-project__name"
          type="text"
          placeholder="Name your group"
        />
        <button
          className="add-project__submit"
          type="button"
          onClick={() => addGroupHandler(props.token)}
        >
          Add Group
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
      <span className="add-project__plus">+</span>
      <span
        className="add-project__text"
        onClick={() => setShow(!show)}
        onKeyDown={() => setShow(!show)}
        role="button"
      >
        Add Group
      </span>
    </div>
  );
};

export default withRouter(AddGroup);
