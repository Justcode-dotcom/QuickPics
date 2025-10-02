import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, ConfigProvider, Tooltip } from "antd";
import LazyLoading from "../LazyLoading";
import "./SearchPage.css";
import { DownloadContext } from "../../Downloadscontext";
import notFound from "../../assets/9318694.jpg";
function SearchPage() {
  const accessKey = `1fS-X-C644cdkG2U0hI8ygxNcVBsdSCHlq54zE9KSsk`;
  const pexelsApiKey = `iBdMSaI4nqiHkv3cH66iny8zXPhfeV6qsq5pTm9QdlFuOPcIeZq0IGPG`;
  const { searchTerm } = useParams();
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("photographer");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  async function loadImages() {
    setImages([]);
    setError("");
    try {
      const isMobile = window.innerWidth < 768;
      const perPage = isMobile ? 30 : 40;
      const res = await axios.get("https://api.pexels.com/v1/search", {
        params: {
          query: searchTerm,
          per_page: perPage,
          page: 2,
        },
        headers: {
          Authorization: `${pexelsApiKey}`,
        },
      });
      if (!res.data.photos || res.data.photos.length === 0) {
        setError(`No results found for "${searchTerm}"`);
        return;
      }
      setImages((prev) => {
        const newPhotos = res.data.photos;

        const unique = newPhotos.filter(
          (photo) => !prev.some((p) => p.id === photo.id)
        );

        return [...prev, ...unique];
      });
    } catch (err) {
      setError(err.message || "something went wrong");
      console.error(err);
    }
  }

  useEffect(() => {
    loadImages();
  }, [searchTerm]);

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
      alert("yup");
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
  return (
    <div className="main">
      {error ? (
        <div className="error-container">
          <img src={notFound} alt="" />
          <h2>No Results Found for {searchTerm}</h2>
          <p>Check your network or Try searching for somthing else.</p>
        </div>
      ) : (
        <>
          <div className="headline">
            <h2>Search results for: {searchTerm}</h2>
          </div>
          <div className="image-wrapper">
            <div className="images">
              {openMenu && window.innerWidth > 768 && (
                <ShareOptions url={selectedImg} />
              )}
              {images.map((img) => (
                <div className="image-container" key={img.id}>
                  <div className="user">
                    <p>By: {img.photographer ?? "Artist"}</p>
                  </div>
                  <div className="img-card">
                    <LazyLoading
                      src={img.src.large}
                      alt={`image by: ${img.photographer}`}
                    />
                  </div>
                  <div className="action-btns">
                    <div className="left-aligned">
                      <button
                        className="action"
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
                      >
                        <i className="fa-solid fa-heart"></i>
                      </button>
                      <ShareOptions url={img.src.large} />
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(img, `Image By: ${img.photographer}`)
                      }
                      className="action"
                    >
                      Download
                    </button>
                  </div>

                  <div className="md-block-user">
                    <p>By: {img.photographer ?? "Artist"}</p>
                  </div>
                  <div className="md-block-action-btns">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="action"
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
                      >
                        <i className="fa-solid fa-heart"></i>
                      </button>
                      {/* <button
                        onClick={() => {
                          setOpenMenu(!openMenu);
                          setSelectedImg(img.src.large);
                          setName(img.photographer);
                        }}
                        className="action"
                      >
                        <i className="fa-solid fa-share-alt"></i>
                      </button> */}
                      <ShareOptions url={img.src.large} />
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(img, `Image By: ${img.photographer}`)
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
        </>
      )}
    </div>
  );
}

export default SearchPage;

{
  /* {openMenu && window.innerWidth > 768 && (
                <ShareOptions url={selectedImg} />
              )} 
                
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
      <>
        <div className="overlay cl-md">
          <div className="share-options">
            <div className="head cl-md">
              <div className="left">
                <h3>
                  Spread{" "}
                  <span style={{ fontStyle: "italic", fontWeight: "600" }}>
                    {name}’s
                  </span>{" "}
                  Inspiration.
                </h3>
                <p>
                  Enjoyed this image? Spread the inspiration with your friends
                  and followers! You can share it directly on supported social
                  media platforms or simply copy the link to share it anywhere
                  you like. Sharing is easy, and every share helps others
                  discover amazing content too!
                </p>
              </div>
              <div className="right cl-md">
                <button
                  className="cl-md"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <i
                    style={{ fontSize: "22px" }}
                    className="fa-solid fa-xmark"
                  ></i>
                </button>
              </div>
            </div>
            <div className="links">
              <p style={{ fontWeight: "600" }} className="cl-md">
                Share it on:
              </p>
              {options.map((opt) =>
                opt.link ? (
                  <ConfigProvider
                    key={opt.name}
                    button={{ style: { margin: 4 } }}
                  >
                    <Tooltip
                      placement="right"
                      title="Like this image"
                      getPopupContainer={() => document.body}
                    >
                      <a
                        // key={opt.name}
                        href={opt.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icons"
                      >
                        <i
                          style={{ color: opt.color }}
                          className={opt.name}
                        ></i>
                      </a>
                    </Tooltip>
                  </ConfigProvider>
                ) : (
                  <button key={opt.name} onClick={opt.action} className="copy">
                    <i className={opt.name}></i>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <div className="links cl-sm">
          {options.map((opt) =>
            opt.link ? (
              <ConfigProvider key={opt.name} button={{ style: { margin: 4 } }}>
                <Tooltip
                  placement="right"
                  title="Like this image"
                  getPopupContainer={() => document.body}
                >
                  <a
                    // key={opt.name}
                    href={opt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icons"
                  >
                    <i style={{ color: opt.color }} className={opt.name}></i>
                  </a>
                </Tooltip>
              </ConfigProvider>
            ) : (
              <button key={opt.name} onClick={opt.action} className="copy">
                <i className={opt.name}></i>
              </button>
            )
          )}
        </div>
      </>
    );
  };
 
   const ShareOptions = ({ url, name, openMenu, setOpenMenu }) => {
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

    if (!openMenu) return null; // render nothing if menu closed

    return (
      <div className="overlay">
        <div className="share-options">
          <div className="head">
            <div className="left">
              <h3>
                Spread{" "}
                <span style={{ fontStyle: "italic", fontWeight: "600" }}>
                  {name}’s
                </span>{" "}
                Inspiration.
              </h3>
              <p>
                Enjoyed this image? Spread the inspiration with your friends and
                followers! You can share it directly on supported social media
                platforms or simply copy the link to share it anywhere you like.
                Sharing is easy, and every share helps others discover amazing
                content too!
              </p>
            </div>
            <div className="right">
              <button onClick={() => setOpenMenu(false)}>
                <i
                  style={{ fontSize: "22px" }}
                  className="fa-solid fa-xmark"
                ></i>
              </button>
            </div>
          </div>

          <div className="links">
            <p style={{ fontWeight: "600" }}>Share it on:</p>
            {options.map((opt) =>
              opt.link ? (
                <ConfigProvider
                  key={opt.name}
                  button={{ style: { margin: 4 } }}
                >
                  <Tooltip
                    placement="top"
                    title="Share"
                    getPopupContainer={() => document.body}
                  >
                    <a
                      href={opt.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icons"
                    >
                      <i style={{ color: opt.color }} className={opt.name}></i>
                    </a>
                  </Tooltip>
                </ConfigProvider>
              ) : (
                <button key={opt.name} onClick={opt.action} className="copy">
                  <i className={opt.name}></i>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };
              
     <Tooltip
                          placement="top"
                          title="Share with friends"
                          getPopupContainer={() => document.body}
                        >
                          <button
                            onClick={() => {
                              setOpenMenu(!openMenu);
                              setSelectedImg(img.src.large);
                              setName(img.photographer);
                            }}
                            className="action"
                          >
                            <i className="fa-solid fa-share-alt"></i>
                          </button>
                        </Tooltip>          
  
  */
}
{
  /* 
<Tooltip
  placement="top"
  title="Share with friends"
  getPopupContainer={() => document.body}
>
  <button
    onClick={() => {
      setOpenMenu(!openMenu);
      setSelectedImg(img.src.large);
      setName(img.photographer);
    }}
    className="action"
  >
    <i className="fa-solid fa-share-alt"></i>
  </button>
</Tooltip> 
                        */
}
