import React from "react";

const About = () => {
  return (
    <div>
      <h2>About</h2>
      <p>
        This is a project that was born out of the deperate need of an app to
        help groups of people decide what to watch on Netflix.
      </p>
      <p>
        Users sign up, create a group, invite their friends, make lists of
        movies (or anything), then vote on which one they most want as a group.
      </p>
      <p>
        It was built with Node.js, Express, MongoDB, Mongoose, React, Redux and
        a few other nifty little packages.
      </p>
      <p>
        Created as a practice project, the code can be found{" "}
        <a href="https://github.com/SmiffyJ/">here</a>
      </p>
    </div>
  );
};

export default About;
