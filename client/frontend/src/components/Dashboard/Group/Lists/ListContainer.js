import React, { useState } from "react";

import AddList from "./AddList";

import { FaTimes } from "react-icons/fa";

import "./ListContainer.css";

const ListContainer = ({
  lists,
  clickedListHandler,
  deleteList,
  token,
  group,
  newList,
  offsetHandler
}) => {
  const [indexClicked, setIndexClicked] = useState();

  const listCSSHandler = index => {
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
          <FaTimes />
        </span>
      </li>
    ));
  }
  return (
    <div className="lists__information">
      <h4>Lists</h4>
      <ul>{renderList}</ul>
      <AddList token={token} group={group} newList={newList} />
    </div>
  );
};

export default ListContainer;
