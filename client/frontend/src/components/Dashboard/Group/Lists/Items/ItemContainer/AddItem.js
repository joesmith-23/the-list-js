import React, { useState } from "react";
import axios from "axios";

import "./AddItem.css";

const AddItem = props => {
  const [show, setShow] = useState();
  const [itemName, setItemName] = useState("");

  const addItemHandler = async token => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`
      }
    };

    const body = {
      name: itemName
    };
    // /api/lists/items/:group_id/:list_id
    const res = await axios.post(
      `/api/lists/items/${props.groupId}/${props.listId}`,
      body,
      config
    );
    props.newItem(res.data.data.list.items[0]);
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
          onClick={() => addItemHandler(props.token)}
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

export default AddItem;
