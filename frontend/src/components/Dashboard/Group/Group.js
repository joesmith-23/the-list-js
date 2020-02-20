import React, { useState, useEffect, useCallback, Fragment } from "react";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../store/actions/dashboardActionCreators";
import ItemContainer from "./Lists/Items/ItemContainer/ItemContainer";
import ListContainer from "./Lists/ListContainer";
import GroupSideBar from "./GroupSideBar/GroupSideBar";
import Loading from "../../utils/Loading/Loading";
import "./Group.css";

const Group = props => {
  const [clickedListId, setClickedListId] = useState("");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (props.token) {
      props.onInitCurrentGroup();
      props.onInitLists();
    }
    // eslint-disable-next-line
  }, []);

  // Destructure onSetActiveList for it to work in useCallback
  const { onSetActiveList } = props;

  const clickedListHandler = useCallback(
    list => {
      setClickedListId(list);
      onSetActiveList(list);
    },
    [onSetActiveList]
  );

  const clickedListCleanup = useCallback(() => {
    const list = {};
    onSetActiveList(list);
  }, [onSetActiveList]);

  useEffect(
    list => {
      if (props.token) clickedListHandler(list);
      return () => {
        if (props.token) clickedListCleanup();
      };
    },
    [clickedListHandler, clickedListCleanup, props.token]
  );

  const deleteMemberHandler = id => {
    props.onDeleteMember(id);
  };

  const deleteListHandler = id => {
    props.onDeleteList(id);
  };

  const offsetHandler = offset => {
    setOffset(offset);
  };

  let renderGroupInfo = null;
  if (props.currentGroup) {
    renderGroupInfo = !props.loading ? (
      <div className="lists__container">
        <GroupSideBar deleteMember={deleteMemberHandler} />
        <div className="main-content__container">
          <ListContainer
            lists={props.lists}
            clickedListHandler={clickedListHandler}
            deleteList={deleteListHandler}
            offsetHandler={offsetHandler}
          />
          <ItemContainer
            list={clickedListId}
            groupId={props.currentGroup._id}
            offset={offset}
          />
        </div>
      </div>
    ) : (
      <Loading />
    );
  }

  return <Fragment>{renderGroupInfo}</Fragment>;
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    currentGroup: state.dashboard.currentGroup,
    lists: state.dashboard.lists,
    loading: state.isLoading.isLoading
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onInitCurrentGroup: () =>
      dispatch(dashboardActionCreators.initCurrentGroup(props)),
    onInitLists: () => dispatch(dashboardActionCreators.initLists(props)),
    onDeleteList: id => dispatch(dashboardActionCreators.deleteList(id)),
    onDeleteMember: id => dispatch(dashboardActionCreators.deleteMember(id)),
    onSetActiveList: list =>
      dispatch(dashboardActionCreators.setActiveList(list))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
