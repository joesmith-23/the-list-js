import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import "./Ratings.css";

const AddRating = props => {
  const [itemRating, setItemRating] = useState("");
  const [averageRating, setAverageRating] = useState("");

  useEffect(() => {
    getAverageRating();
  }, []);

  const getAverageRating = async () => {
    const response = await axios
      .get(
        `/api/lists/ratings/${props.groupId}/${props.listId}/${props.itemId}`,
        props.config
      )
      .catch(error => console.log(error.response.data.message));
    if (response) setAverageRating(response.data.data.averageRating);
  };

  const addRatingHandler = async () => {
    const body = {
      value: itemRating
    };
    // /api/lists/items/ratings/:group_id/:list_id/:item_id
    console.log(props.itemId);
    await axios
      .post(
        `/api/lists/items/ratings/${props.groupId}/${props.listId}/${props.itemId}`,
        body,
        props.config
      )
      .then(response => {
        getAverageRating();
      })
      .catch(error => console.log(error.response.data.message));
  };

  return (
    <Fragment>
      <span className="rating__number">
        <strong>{averageRating}</strong>
      </span>
      {/* <input
        value={itemRating}
        onChange={e => setItemRating(e.target.value)}
        className="add-project__name"
        type="number"
        placeholder="Rate the item"
      /> */}
      <select onChange={e => setItemRating(e.target.value)}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <p
        className="add-rating__submit"
        type="button"
        onClick={() => addRatingHandler()}
      >
        Add Rating
      </p>
    </Fragment>
  );
};

export default AddRating;
