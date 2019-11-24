import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import AddList from "./AddList";

import { FaTimes } from "react-icons/fa";

import "./ListContainer.css";

const ListContainer = ({
  lists,
  clickedListHandler,
  deleteList,
  offsetHandler
}) => {
  const [indexClicked, setIndexClicked] = useState();

  const listCSSHandler = index => {
    // The multiplier is the height of each list in px
    // The total offset is used to display the items below the currently clicked list
    const multiplier = index + 1;
    offsetHandler(33 * multiplier + 20);
    setIndexClicked(index);
  };

  let renderList = [];
  if (lists) {
    renderList = lists.map((list, index) => (
      <li
        className={
          index === indexClicked
            ? "lists__card lists__card--active"
            : "lists__card"
        }
        key={list._id}
      >
        <span
          className="lists__name"
          onClick={() => {
            clickedListHandler(list);
            listCSSHandler(index);
          }}
        >
          {list.name}
        </span>
        <span className="spacer"></span>
        <span className="lists__delete" onClick={() => deleteList(list._id)}>
          <FaTimes data-tip="Delete List" />
          <ReactTooltip
            place="bottom"
            effect="solid"
            className="lists__tooltip"
          />
        </span>
      </li>
    ));
  }
  return (
    <div className="lists__information">
      <h2>Lists</h2>
      <ul>{renderList}</ul>
      <AddList />
    </div>
  );
};

export default ListContainer;
