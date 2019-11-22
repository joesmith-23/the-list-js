import React, { useState, useEffect, useCallback, Fragment } from "react";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../../../../store/actions/dashboardActionCreators";

import "./Ratings.css";

const Ratings = props => {
  const [itemRating, setItemRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [starHover, setStarHover] = useState(null);

  const getAverageRating = useCallback(() => {
    props.activeItems.forEach(item => {
      if (item._id === props.itemId) {
        setAverageRating(item.averageRating.toFixed(1));
      }
    });
  }, [props.activeItems, props.itemId]);

  useEffect(() => {
    getAverageRating();
  }, [getAverageRating]);

  const addRatingHandler = async () => {
    const body = {
      value: itemRating
    };
    // /api/lists/items/ratings/:group_id/:list_id/:item_id
    await axios
      .post(
        `/api/lists/items/ratings/${props.groupId}/${props.listId}/${props.itemId}`,
        body
      )
      .then(response => {
        console.log(response);
        props.onSetAverageRating(
          response.data.data.item.averageRating.toFixed(1),
          props.itemId
        );
      })
      .catch(error => console.error(error));
  };

  return (
    <Fragment>
      <StarRatingComponent
        name="ratings"
        starCount={10}
        value={starHover}
        onStarClick={nextValue => setItemRating(nextValue)}
        onStarHover={nextValue => {
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

const mapStateToProps = state => {
  return {
    currentGroup: state.dashboard.currentGroup,
    lists: state.dashboard.lists,
    activeItems: state.dashboard.activeList.items
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetAverageRating: (rating, itemId) =>
      dispatch(dashboardActionCreators.setAverageRating(rating, itemId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ratings);
