import React, { useState } from "react";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../../../../store/actions/dashboardActionCreators";

import "./AddItem.css";

const AddItem = props => {
  const [show, setShow] = useState();
  const [itemName, setItemName] = useState("");

  const addItemHandler = async () => {
    const body = {
      name: itemName
    };
    props.onAddItem(body);
  };

  let content = null;
  if (show)
    content = (
      <div className="add-item__input">
        <input
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          className="add-item__name"
          type="text"
          placeholder="Name your item"
        />
        <button
          className="add-item__submit"
          type="button"
          onClick={() => addItemHandler()}
        >
          Add Item
        </button>
        <span
          className="add-item__cancel"
          onClick={() => setShow(false)}
          onKeyDown={() => setShow(false)}
          role="button"
        >
          Cancel
        </span>
      </div>
    );

  let addItemText = null;
  if (!show) {
    addItemText = (
      <div className="add-element">
        <span className="add-item__plus">+</span>
        <span
          className="add-item__text "
          onClick={() => setShow(!show)}
          onKeyDown={() => setShow(!show)}
          role="button"
        >
          Add Item
        </span>
      </div>
    );
  }

  return (
    <div>
      {content}
      {addItemText}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onAddItem: body => dispatch(dashboardActionCreators.addItem(body))
  };
};

export default connect(null, mapDispatchToProps)(AddItem);
