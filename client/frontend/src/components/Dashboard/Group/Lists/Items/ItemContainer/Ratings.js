import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";

import "./Ratings.css";

const AddRating = props => {
  const [itemRating, setItemRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [starHover, setStarHover] = useState(null);

  useEffect(() => {
    getAverageRating();
  }, []);

  const getAverageRating = async () => {
    const response = await axios
      .get(
        `/api/lists/ratings/${props.groupId}/${props.listId}/${props.itemId}`
      )
      .catch(error => console.log(error.response.data.message));
    if (response) {
      setAverageRating(parseInt(response.data.data.averageRating));
    }
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
        body
      )
      .then(response => {
        console.log(response);
        getAverageRating();
      })
      .catch(error => console.log(error.response.data.message));
  };

  return (
    <Fragment>
      <span className="rating__number">
        <strong>{averageRating}</strong>
        <small className="out-of-10">/10</small>
      </span>
      <StarRatingComponent
        name="ratings"
        starCount={10}
        value={starHover}
        onStarClick={(nextValue, prevValue, name) => setItemRating(nextValue)}
        onStarHover={(nextValue, prevValue, name) => {
          setStarHover(nextValue);
          setItemRating(nextValue);
        }}
      />
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
