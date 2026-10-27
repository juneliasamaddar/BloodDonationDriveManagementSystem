import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          Blood Donation Drive
        </a>
        <span className="navbar-text text-white">
          Management System
        </span>
      </div>
    </nav>
  );
}

export default Navbar;