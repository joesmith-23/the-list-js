import React, { useState } from "react";
import axios from "axios";

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
      <div className="add-project__input">
        <input
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          className="add-project__name"
          type="text"
          placeholder="Name your item"
        />
        <button
          className="add-project__submit"
          type="button"
          onClick={() => addItemHandler(props.token)}
        >
          Add Item
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
        Add Item
      </span>
    </div>
  );
};

export default AddItem;
