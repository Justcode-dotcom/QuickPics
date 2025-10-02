import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ConfigProvider, Tooltip } from "antd";
import axios from "axios";
import "./HomePage.css";
import { DownloadContext } from "../../Downloadscontext";
import LazyLoading from "../LazyLoading";
function HomePage() {
  const unsplashApiKey = `1fS-X-C644cdkG2U0hI8ygxNcVBsdSCHlq54zE9KSsk`;
  const pexelsApiKey = `iBdMSaI4nqiHkv3cH66iny8zXPhfeV6qsq5pTm9QdlFuOPcIeZq0IGPG`;
  const nav = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("photographer");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // async function loadImages() {
  //   const res = await axios.get("https://api.pexels.com/v1/search", {
  //     params: { query: "nature", per_page: 12, page: currentPage },
  //     headers: {
  //       Authorization: `${pexelsApiKey}`,
  //     },
  //   });
  //   setImages((prev) => [...prev, ...res.data.photos]);
  //   setCurrentPage(currentPage + 1);
  //   console.log(images);
  // }
  const accessKey = `1fS-X-C644cdkG2U0hI8ygxNcVBsdSCHlq54zE9KSsk`;
  const buttons = ["America", "Ninja", "BMW", "Conversation"];
  const test = async () => {
    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: "nature",
          page: currentPage,
          per_page: 12,
          client_id: accessKey,
        },
      });
      setImages((prev) => {
        const newPhotos = res.data.results;

        // filter out duplicates by id
        const unique = newPhotos.filter(
          (photo) => !prev.some((p) => p.id === photo.id)
        );

        return [...prev, ...unique];
      });
      setCurrentPage(currentPage + 1);
      // console.log(res.data.results); // the array of images
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // loadImages();
    test();
  }, []);

  const ShareOptions = ({ url }) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = "Check this image at QuickPics";
    const options = [
      {
        name: "fab fa-x-twitter",
        link: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        color: "#000",
      },
      {
        name: "fab fa-reddit",
        link: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
        color: "#FF4500",
      },
      {
        name: "fab fa-telegram",
        link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        color: "#0088CC",
      },
      {
        name: "fa-solid fa-link",
        action: () => {
          navigator.clipboard.writeText(url);
          alert("Link copied!");
        },
      },
    ];

    return (
      <div className="share-options">
        <div className="links">
          {options.map((opt) =>
            opt.link ? (
              <a
                key={opt.name}
                href={opt.link}
                target="_blank"
                rel="noopener noreferrer"
                className="icons"
              >
                <i style={{ color: opt.color }} className={opt.name}></i>
              </a>
            ) : (
              <button key={opt.name} onClick={opt.action} className="copy">
                <i className={opt.name}></i>
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  const { addDownload, addFavorites, favorites } = useContext(DownloadContext);
  const isFavorite = (imageId) => {
    return favorites.some((fav) => fav.id === imageId);
  };
  const handleDownload = async (img, filename = "image.jpg") => {
    try {
      const response = await fetch(img.src.large);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      addDownload(img);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  const handleFavorites = (img) => {
    addFavorites(img);
  };
  // const handleShare = async (url, text) => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "Check out this image!",
  //         text: text,
  //         url,
  //       });
  //       console.log("Shared successfully!");
  //     } catch (error) {
  //       console.error("Share failed:", error);
  //     }
  //   } else {
  //     // Fallback: copy to clipboard
  //     try {
  //       await navigator.clipboard.writeText(url);
  //       alert("Image link copied to clipboard!");
  //     } catch (error) {
  //       console.error("Clipboard copy failed:", error);
  //     }
  //   }
  // };

  // console.log(images);
  return (
    <>
      <div className="hero-container">
        <div className="hero first-hero">
          <h2>A universe of photos, one click away.</h2>
          <p style={{ color: "#333", fontWeight: "600" }}>
            Discover stunning photos from around the world. Search by keyword,
            share with friends, and download your favorites in just a click.
            Simple, fast, and built for creators like you.
          </p>
          <button className="md-none" onClick={() => nav("/categories")}>
            Start Exploring
          </button>
        </div>
        <div className="lg-block hero">
          <div className="btns">
            {buttons.map((btn, i) => (
              <button key={i} onClick={() => nav(`/categories/${btn}`)}>
                {btn}
              </button>
            ))}
          </div>
          <p
            style={{ marginTop: "150px", fontSize: "18px", color: "#5a5a5aff" }}
          >
            <span className="material-symbols-outlined trending">
              trending_up
            </span>{" "}
            trending searches
          </p>
        </div>
        <div className="md-block hero">
          <div className="left-container">
            <i className="fa-regular fa-image"></i>
            <h2>
              The easiest way <br />
              <span style={{ color: "#ccc" }}>
                to find and save <br /> images.
              </span>
            </h2>
            <button onClick={() => nav("/categories")}>Start Exploring</button>
          </div>
          <div className="svg-img">
            <img
              src="https://unsplash-assets.imgix.net/illustrations-module/1-col.png?auto=format&amp;fit=crop&amp;q=60"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="main">
        <div className="sub-section">
          <h3>
            Over thousands of high quality stock images shared by talented
            peoples.
          </h3>
          <div className="filter-section">
            {/* the filtering stufs will spot here */}
          </div>
        </div>
        {/* btn > filter, filter/nature */}
        <div className="image-wrapper">
          <div className="images">
            {images.map((img) => (
              <div className="image-container" key={img.id}>
                <div className="user">
                  <p>By: {img.user.first_name ?? "Artist"}</p>
                </div>
                <div className="img-card">
                  <LazyLoading
                    src={img.urls.full}
                    alt={`image by: ${img.user.first_name}`}
                  />
                </div>
                <div className="action-btns">
                  <div className="left-aligned">
                    <button
                      style={{
                        color: isFavorite(img.id)
                          ? "#ff4d4f"
                          : "rgb(94, 94, 94)",
                        borderColor: isFavorite(img.id)
                          ? "#ff4d4f"
                          : "rgba(128, 128, 128, 0.555)",
                      }}
                      onClick={() => {
                        handleFavorites(img);
                      }}
                      className="action"
                    >
                      <i className="fa-solid fa-heart"></i>
                    </button>

                    <ShareOptions url={img.urls.full} />
                  </div>

                  <button
                    onClick={() =>
                      handleDownload(img, `Image By: ${img.user.first_name}`)
                    }
                    className="action"
                  >
                    Download
                  </button>
                </div>

                <div className="md-block-user">
                  <p>By: {img.user.first_name ?? "Artist"}</p>
                </div>
                <div className="md-block-action-btns">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      style={{
                        color: isFavorite(img.id)
                          ? "#ff4d4f"
                          : "rgb(94, 94, 94)",
                        borderColor: isFavorite(img.id)
                          ? "#ff4d4f"
                          : "rgba(128, 128, 128, 0.555)",
                        // marginRight: "10px",
                      }}
                      onClick={() => {
                        handleFavorites(img);
                      }}
                      className="action"
                    >
                      <i className="fa-solid fa-heart"></i>
                    </button>
                    {/* <button
                      onClick={() => {
                        setOpenMenu(!openMenu);
                        setSelectedImg(img.urls.full);
                        setName(img.user.first_name);
                      }}
                      className="action"
                    >
                      <i className="fa-solid fa-share-alt"></i>
                    </button> */}
                    <ShareOptions url={img.urls.full} />
                  </div>
                  <button
                    onClick={() =>
                      handleDownload(img, `Image By: ${img.user.first_name}`)
                    }
                    className="action"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="more-btn">
          {images.length !== 0 && (
            <button onClick={() => test()}>Discover more</button>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
