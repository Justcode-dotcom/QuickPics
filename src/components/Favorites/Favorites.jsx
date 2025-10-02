import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";
import { DownloadContext } from "../../Downloadscontext";
function Favorites() {
  const { favorites, setFavorites, addDownload } = useContext(DownloadContext);
  const nav = useNavigate();
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

  function handleRemove(id) {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.id !== id)
    );
  }

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
  return (
    <>
      {favorites.length === 0 && (
        <div className="no-result">
          <h2>No favorite images yet.</h2>
          <button className="find" onClick={() => nav("/categories")}>
            Find your Favorites
          </button>
        </div>
      )}
      {favorites.length > 0 && (
        <div className="main" style={{ marginTop: "90px" }}>
          <div className="cards">
            {favorites.map((img) => (
              <div key={img.id} className="card">
                <div className="card-img">
                  <img src={img?.src?.large ?? img?.urls?.full} alt="" />
                </div>
                <div className="card-text">
                  <h3>{img?.alt ?? img?.alt_description}</h3>
                  <p style={{ fontWeight: 600 }}>
                    Photo by {img?.photographer ?? img?.user?.first_name}
                  </p>
                  <ShareOptions url={img?.src?.large ?? img?.urls?.full} />
                  <div className="fav-btns">
                    <button
                      onClick={() =>
                        handleDownload(
                          img,
                          `${img?.photographer ?? img?.user?.first_name}`
                        )
                      }
                      className="download"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleRemove(img.id)}
                      className="remove"
                    >
                      Delete from favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* )} */}
    </>
  );
}

export default Favorites;
