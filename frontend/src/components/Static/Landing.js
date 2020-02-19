import React, { Fragment, useRef, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { FiUsers, FiList } from "react-icons/fi";
import { FaArrowsAlt } from "react-icons/fa";

import "./Landing.css";

const Landing = props => {
  const canvas = useRef();

  useEffect(() => {
    if (props.location.pathname === "/") {
      animatePurple();
    }
  }, []);

  let increment = 0.01;
  let lineWidth = 500;
  const animatePurple = () => {
    try {
      requestAnimationFrame(animatePurple);
      const Canvas = canvas.current;
      const ctx = canvas.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(-50, Canvas.height / 2);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "#965caf";
      for (let i = -50; i < Canvas.width + 50; i++) {
        ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        ctx.lineTo(
          i,
          Canvas.height / 2.5 +
            Math.sin(i * 0.005 + increment) * 20 * Math.sin(increment)
        );
      }
      ctx.stroke();
      increment += 0.01;
    } catch (error) {}
  };

  let svg = (
    <svg
      version="1.1"
      className="svg__wave"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 1920 300"
      enableBackground="new 0 0 1920 300"
    >
      <path
        className="svg__wave"
        d="M0,300c0,0,291.3-79.9,470.2-79.9c172.2,0,316.6,39.9,504.4,39.9c195.6,0,420-28.8,602.2-25.5
	C1778,238.2,1920,300,1920,300"
      />
    </svg>
  );

  let canvasRender = null;
  if (window.innerWidth > 1025) {
    canvasRender = (
      <canvas
        ref={canvas}
        width={window.innerWidth}
        height={window.innerHeight}
        className="canvas"
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    );
  }

  return (
    <Fragment>
      <section className="hero">
        <div className="hero__container">
          <h1>The List</h1>
          <h2>An app for groups of people that can't make decisions</h2>
          <button>
            <Link to={props.currentUser ? "/dashboard" : "/register"}>
              {props.currentUser ? "Go to your dashboard" : "Create an account"}
            </Link>
          </button>
        </div>
        <div className="hero__canvas">{canvasRender}</div>
        {svg}
      </section>
      <section>
        <div className="info__container">
          <h2>What is this site?</h2>
          <p className="mission__text">
            The List allows groups of friends, colleagues or any group of people
            that need to make a decision to do so easily and simply.
          </p>
          <div className="row">
            <div className="feature__container">
              <div className="feature__title">
                <h2>Create Groups</h2>
              </div>
              <div className="feature__image">
                <FiUsers />
              </div>
              <div className="feature__text">
                Create groups with your friends
              </div>
            </div>
            <div className="feature__container">
              <div className="feature__title">
                <h2>Add Options</h2>
              </div>
              <div className="feature__image">
                <FiList />
              </div>
              <div className="feature__text">
                Make lists of things you need help deciding
              </div>
            </div>
            <div className="feature__container">
              <div className="feature__title">
                <h2>Vote and Decide</h2>
              </div>
              <div className="feature__image">
                <FaArrowsAlt />
              </div>
              <div className="feature__text">
                Add options and vote on them to decide which one the group
                should do
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.user.user
  };
};

export default connect(mapStateToProps)(withRouter(Landing));
