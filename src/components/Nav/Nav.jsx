import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ConfigProvider, Tooltip } from "antd";
import "./Nav.css";
import logo from "../../assets/logo.png";
function Nav() {
  const nav = useNavigate();
  const [largeNav, setLargeNav] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [term, setTerm] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setLargeNav(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleSearch = () => {
    if (term.trim()) {
      nav(`/results/${encodeURIComponent(term)}`);
    }
    setTerm("");
  };

  const buttons = [
    "nature",
    "flowers",
    "sky",
    "wallpaper",
    "office",
    "forest",
    "background",
    "sunset",
    "cat",
    "beach",
    "dog",
  ];
  return (
    <div className="header">
      {!largeNav ? (
        <>
          <div className="nav">
            <div className="upper-nav">
              <div className="logo">
                <Link to={"/"}>
                  <img className="logo-img" src={logo} alt="logo" />
                </Link>
                <h1 style={{ cursor: "pointer" }}>
                  <Link to={"/"} className="back-home">
                    QuickPics
                  </Link>
                </h1>
              </div>
              <div className="nav-input">
                <i
                  onClick={handleSearch}
                  className="fa-solid fa-magnifying-glass search-btn"
                ></i>
                <input
                  name="search"
                  className="input"
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="search images..."
                />
              </div>
              <div className="menu">
                <button onClick={() => setOpenMenu(!openMenu)} className="menu">
                  <i className="fas fa-bars"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="lower-nav">
            <div className="filter-btns">
              {buttons.map((btn, i) => (
                <button
                  className="fil-btn"
                  key={i}
                  onClick={() => nav(`/categories/${btn}`)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
          {openMenu && (
            <div className="menu-container">
              <div className="mobile-nav">
                <img src={logo} alt="logo" />
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <i
                    style={{ fontSize: "22px" }}
                    className="fa-solid fa-xmark"
                  ></i>
                </button>
              </div>
              <ul>
                <li>
                  <Link
                    onClick={() => setOpenMenu(!openMenu)}
                    className="link"
                    to={"/"}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setOpenMenu(!openMenu)}
                    className="link"
                    to={"/categories/"}
                  >
                    Photos
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setOpenMenu(!openMenu)}
                    className="link"
                    to={"/favorite"}
                  >
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setOpenMenu(!openMenu)}
                    className="link"
                    to={"/downloads"}
                  >
                    Downloads
                  </Link>
                </li>
              </ul>
              <div className="cta">
                <button className="connect mobile">
                  <a
                    href="https://t.me/letsgo63"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Connect
                  </a>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="large-nav">
          <div className="sider">
            <div className="sider-logo">
              <Link>
                <img src={logo} alt="" />
              </Link>
            </div>
            <ConfigProvider>
              <div className="sider-navs">
                <Tooltip
                  placement="right"
                  title="Photos"
                  getPopupContainer={() => document.body}
                >
                  <Link to={"/categories/"}>
                    <i className="fa-regular fa-images"></i>
                  </Link>
                </Tooltip>
                <Tooltip
                  placement="right"
                  title="Favorites"
                  getPopupContainer={() => document.body}
                >
                  <Link to={"/favorite"}>
                    <i className="fa-regular fa-heart"></i>
                  </Link>
                </Tooltip>
                <Tooltip
                  placement="right"
                  title="Downloads"
                  getPopupContainer={() => document.body}
                >
                  <Link to={"/downloads"}>
                    <i className="fa-solid fa-cloud-arrow-down"></i>
                  </Link>
                </Tooltip>
              </div>
            </ConfigProvider>
          </div>
          <div className="nav">
            <div className="upper-nav">
              <div className="logo">
                <h1 style={{ cursor: "pointer" }}>
                  <Link to={"/"} className="back-home">
                    QuickPics
                  </Link>
                </h1>
              </div>
              <div className="nav-input">
                <i
                  onClick={handleSearch}
                  className="fa-solid fa-magnifying-glass search-btn"
                ></i>
                <input
                  name="search"
                  className="input"
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="search images..."
                />
              </div>
              <button className="connect large">
                <a
                  href="https://t.me/letsgo63"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Connect
                </a>
              </button>
            </div>
          </div>
          <div className="lower-nav">
            <div className="filter-btns">
              {buttons.map((btn, i) => (
                <button
                  className="fil-btn"
                  key={i}
                  onClick={() => nav(`/categories/${btn}`)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
