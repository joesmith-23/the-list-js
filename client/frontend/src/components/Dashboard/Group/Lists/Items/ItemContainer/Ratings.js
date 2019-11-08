import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div>
      <strong>{averageRating}</strong>
      <input
        value={itemRating}
        onChange={e => setItemRating(e.target.value)}
        className="add-project__name"
        type="number"
        placeholder="Rate the item"
      />
      <button
        className="add-project__submit"
        type="button"
        onClick={() => addRatingHandler()}
      >
        Add Rating
      </button>
    </div>
  );
};

export default AddRating;
