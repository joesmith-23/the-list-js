import React from "react";
import AddItem from "./AddItem";
import axios from "axios";

import Ratings from "./Ratings";

import { FaTimes } from "react-icons/fa";
import "./ItemContainer.css";

const ItemContainer = props => {
  const deleteItem = async itemId => {
    // /api/lists/items/:group_id/:list_id/:item_id
    await axios.delete(
      `/api/lists/items/${props.groupId}/${props.list._id}/${itemId}`,
      props.config
    );
    props.deleteItem(itemId);
  };

  let items = [];
  if (props.items) {
    items = props.items.map(item => (
      <li className="item__card" key={item._id}>
        <span className="item__name">{item.name}</span>
        <span className="spacer"></span>
        <Ratings
          config={props.config}
          listId={props.list._id}
          groupId={props.groupId}
          itemId={item._id}
        />
        <span className="spacer"></span>
        <span className="item__delete" onClick={() => deleteItem(item._id)}>
          {"  "}
          <FaTimes />
        </span>
      </li>
    ));
  }

  let offsetStyle = {
    marginTop: props.offset
  };

  return (
    <div className="item__container">
      <h4>Items</h4>
      {/* <div>{props.list._id}</div> */}
      <div className="items-list__container">
        <ul style={offsetStyle}>{items}</ul>
      </div>
      {props.items ? (
        <AddItem
          groupId={props.groupId}
          listId={props.list._id}
          token={props.token}
          newItem={props.newItemHandler}
        />
      ) : null}
    </div>
  );
};

export default ItemContainer;
