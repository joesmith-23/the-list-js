import React, { useState } from "react";
import AddItem from "./AddItem";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../../../../store/actions/dashboardActionCreators";
import Ratings from "./Ratings";

import { FaTimes, FaChevronDown } from "react-icons/fa";
import "./ItemContainer.css";

const ItemContainer = props => {
  const [hidden, setHidden] = useState({});

  // TODO - I think there needs to be some cleanup here to do with the opening and closing of the items

  const deleteItem = async itemId => {
    // /api/lists/items/:group_id/:list_id/:item_id
    // await axios.delete(
    //   `/api/lists/items/${props.groupId}/${props.list._id}/${itemId}`
    // );
    props.onDeleteItem(itemId);
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
  if (props.activeList && props.activeList.items) {
    items = props.activeList.items.map(item => (
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
                <strong>{item.averageRating.toFixed(1)}</strong>
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
      {props.activeList ? (
        <AddItem
          groupId={props.currentGroup._id}
          listId={props.list._id}
          newItem={props.newItemHandler}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    currentGroup: state.dashboard.currentGroup,
    lists: state.dashboard.lists,
    activeList: state.dashboard.activeList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteItem: itemId => dispatch(dashboardActionCreators.deleteItem(itemId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemContainer);
