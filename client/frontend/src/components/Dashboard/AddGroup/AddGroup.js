import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../store/actions/dashboardActionCreators";

import "./AddGroup.css";

const AddGroup = props => {
  const [show, setShow] = useState();
  const [groupName, setGroupName] = useState("");

  const addGroupHandler = async () => {
    const body = {
      name: groupName
    };
    props.onAddGroupHandler(body);
    // TODO - Maybe come up with a better way of doing this
    window.location.reload();
  };

  let content = null;
  if (show)
    content = (
      <div className="add-group__input">
        <input
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          className="add-group__name"
          type="text"
          placeholder="Name your group"
        />
        <button
          className="add-group__submit"
          type="button"
          onClick={() => addGroupHandler(props.token)}
        >
          Add Group
        </button>
        <span
          className="add-group__cancel"
          onClick={() => setShow(false)}
          onKeyDown={() => setShow(false)}
          role="button"
        >
          Cancel
        </span>
      </div>
    );

  let addGroupText = null;
  if (!show)
    addGroupText = (
      <div className="add-group__text">
        <span>+ </span>
        <span
          onClick={() => setShow(!show)}
          onKeyDown={() => setShow(!show)}
          role="button"
        >
          Add Group
        </span>
      </div>
    );
  return (
    <div>
      {content}
      {addGroupText}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onAddGroupHandler: body => dispatch(dashboardActionCreators.addGroup(body))
  };
};

export default connect(null, mapDispatchToProps)(withRouter(AddGroup));
