import React, { useState } from "react";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../../../store/actions/dashboardActionCreators";

import "./AddList.css";

const AddList = props => {
  const [show, setShow] = useState();
  const [listName, setListName] = useState("");

  const addListHandler = () => {
    const body = {
      name: listName
    };
    props.onAddList(body);
  };

  let content = null;
  if (show)
    content = (
      <div className="add-list__input">
        <input
          value={listName}
          onChange={e => setListName(e.target.value)}
          className="add-list__name"
          type="text"
          placeholder="Name your list"
        />
        <button
          className="add-list__submit"
          type="button"
          onClick={() => addListHandler()}
        >
          Add List
        </button>
        <span
          className="add-list__cancel"
          onClick={() => setShow(false)}
          onKeyDown={() => setShow(false)}
          role="button"
        >
          Cancel
        </span>
      </div>
    );

  let addListText = null;
  if (!show) {
    addListText = (
      <div>
        <span className="add-list__plus add-element">+</span>
        <span
          className="add-list__text add-element"
          onClick={() => setShow(!show)}
          onKeyDown={() => setShow(!show)}
          role="button"
        >
          Add List
        </span>
      </div>
    );
  }

  return (
    <div>
      {content}
      {addListText}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onAddList: newList => dispatch(dashboardActionCreators.addList(newList))
  };
};

export default connect(null, mapDispatchToProps)(AddList);
