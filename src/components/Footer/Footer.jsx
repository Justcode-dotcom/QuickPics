import React, { useState, useEffect } from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <h3>
        &copy; {new Date().getFullYear()}{" "}
        <a
          style={{ textDecoration: "none", color: "#333", fontWeight: "700" }}
          href="https://t.me/letsgo63"
        >
          ice bear
        </a>
      </h3>
    </div>
  );
}

export default Footer;
