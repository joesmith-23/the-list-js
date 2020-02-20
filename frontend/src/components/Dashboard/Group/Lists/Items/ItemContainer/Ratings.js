import React, { useState, Fragment } from "react";
import StarRatingComponent from "react-star-rating-component";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../../../../store/actions/dashboardActionCreators";

import "./Ratings.css";

const Ratings = props => {
  const [itemRating, setItemRating] = useState(null);
  const [starHover, setStarHover] = useState(null);

  const addRatingHandler = async () => {
    const body = {
      value: itemRating
    };
    props.onAddRating(props.itemId, body);
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
    onSetAverageRating: (rating, ratingList, itemId) =>
      dispatch(
        dashboardActionCreators.setAverageRating(rating, ratingList, itemId)
      ),
    onAddRating: (itemId, body) =>
      dispatch(dashboardActionCreators.addRating(itemId, body))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ratings);
