import React, { useState } from "react";
import AddItem from "./AddItem";
import axios from "axios";
import ReactTooltip from "react-tooltip";

import Ratings from "./Ratings";

import { FaTimes, FaChevronDown } from "react-icons/fa";
import "./ItemContainer.css";

const ItemContainer = props => {
  const [hidden, setHidden] = useState({});

  // TODO - I think there needs to be some cleanup here to do with the opening and closing of the items

  const deleteItem = async itemId => {
    // /api/lists/items/:group_id/:list_id/:item_id
    await axios.delete(
      `/api/lists/items/${props.groupId}/${props.list._id}/${itemId}`
    );
    props.deleteItem(itemId);
  };

  const ratingVisibleHandler = id => {
    let newValue = hidden[id];
    if (newValue) {
      newValue = !hidden[id];
    } else {
      newValue = true;
    }
    setHidden({
      ...hidden,
      [id]: newValue
    });
  };

  let items = [];

  if (props.items) {
    items = props.items.map(item => (
      <li className="item__card" key={item._id}>
        <div className="item__card-container">
          <div className="item__card-title">
            <span className={hidden[item._id] === true ? "" : "rotated"}>
              <span
                onClick={() => ratingVisibleHandler(item._id)}
                className="item__chevron"
              >
                <FaChevronDown />
              </span>
            </span>
            <div className="item__name-spacing">
              <span
                onClick={() => ratingVisibleHandler(item._id)}
                className="item__name "
              >
                {item.name}
              </span>
              <span className="rating__number">
                <strong>#</strong>
                <small className="out-of-10">/10</small>
                <small> ({item.rating.length})</small>
              </span>
            </div>
          </div>
          <div
            className={
              hidden[item._id] === true
                ? "item__card-rating"
                : "item__card-rating item__card-hidden"
            }
          >
            <Ratings
              listId={props.list._id}
              groupId={props.groupId}
              itemId={item._id}
              numberOfRatings={item.rating.length}
            />
            <span className="item__delete" onClick={() => deleteItem(item._id)}>
              {"  "}
              <FaTimes data-tip="Delete Item" />
              <ReactTooltip
                place="bottom"
                effect="solid"
                className="item__tooltip"
              />
            </span>
          </div>
        </div>
      </li>
    ));
  }

  let offsetStyle = {
    marginTop: props.offset
  };

  return (
    <div className="item__container">
      <h2>Items</h2>
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
