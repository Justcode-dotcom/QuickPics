import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button, ConfigProvider, Tooltip } from "antd";
import LazyLoading from "../LazyLoading";
import { DownloadContext } from "../../Downloadscontext";
import "./CategoryPage.css";
import confused from "../../assets/confused.jpg";
function CategoryPage() {
  const { category } = useParams();
  const accessKey = `1fS-X-C644cdkG2U0hI8ygxNcVBsdSCHlq54zE9KSsk`;
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("photographer");
  const [currentPage, setCurrentPage] = useState(1);
  async function loadImages() {
    setError("");
    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: `${category ?? "nature"}`,
          page: currentPage,
          per_page: 12,
          client_id: accessKey,
        },
      });
      if (!res.data.results || res.data.results.length === 0) {
        setError(`something went wrong`);
        return;
      }
      setImages((prev) => {
        const newPhotos = res.data.results;

        // filter out duplicates by id
        const unique = newPhotos.filter(
          (photo) => !prev.some((p) => p.id === photo.id)
        );

        return [...prev, ...unique];
      });
      setCurrentPage(currentPage + 1);
    } catch (err) {
      setError(err.message || "something went wrong");
    }
  }
  useEffect(() => {
    setImages([]);
    setCurrentPage(1);
    loadImages();
  }, [category]);

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
  const { addDownload, addFavorites, downloads, favorites } =
    useContext(DownloadContext);
  const isFavorite = (imageId) => {
    return favorites.some((fav) => fav.id === imageId);
  };
  const handleDownload = async (img, filename = "image.jpg") => {
    try {
      const response = await fetch(img.urls.full);
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
  return (
    <div className="main">
      {error ? (
        <div className="error-container">
          <img src={confused} alt="" />
          <h2>Something went wrong</h2>
          <Link className="back" to={"/"}>
            <button style={{ color: "white" }}>Back to home</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="headline">
            <h2>
              {!category
                ? `Explore free images around the world`
                : `Free ${category} images`}
            </h2>
          </div>
          <div className="image-wrapper">
            <div className="images">
              {openMenu && window.innerWidth > 768 && (
                <ShareOptions url={selectedImg} />
              )}
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
                          marginRight: "10px",
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
              <button onClick={() => loadImages()}>Discover more</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryPage;
