import React, { useState } from "react";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../../store/actions/dashboardActionCreators";

import "./AddMember.css";

const AddMember = props => {
  const [show, setShow] = useState();
  const [newMember, setNewMember] = useState("");

  const addMemberHandler = async () => {
    const body = {
      email: newMember
    };
    props.onAddMember(body);
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
          onClick={() => addMemberHandler()}
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

const mapDispatchToProps = dispatch => {
  return {
    onAddMember: newMember =>
      dispatch(dashboardActionCreators.addMember(newMember))
  };
};

export default connect(null, mapDispatchToProps)(AddMember);
