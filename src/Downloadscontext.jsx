import React, { useState, createContext, useEffect } from "react";
export const DownloadContext = createContext();
export const DownloadProvider = ({ children }) => {
  const [downloads, setDownloads] = useState(() => {
    const imgs = localStorage.getItem("downloads");
    return imgs ? JSON.parse(imgs) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const imgs = localStorage.getItem("favs");
    return imgs ? JSON.parse(imgs) : [];
  });
  useEffect(() => {
    localStorage.setItem("favs", JSON.stringify(favorites));
    localStorage.setItem("downloads", JSON.stringify(downloads));
  }, [favorites, downloads]);

  // function to add a downloaded image
  const addDownload = (img) => {
    setDownloads((prev) => {
      // Filter to prevent duplicates
      if (prev.some((download) => download.id === img.id)) {
        return prev; // Already exists, return unchanged
      }
      return [...prev, img];
    });
  };
  const addFavorites = (img) => {
    setFavorites((prevFavorites) => {
      // Check if image already exists in favorites
      const alreadyExists = prevFavorites.some((fav) => fav.id === img.id);

      if (alreadyExists) {
        // Remove from favorites
        return prevFavorites.filter((fav) => fav.id !== img.id);
      } else {
        // Add to favorites (with filter to prevent duplicates)
        return [...prevFavorites, img];
      }
    });
  };

  return (
    <DownloadContext.Provider
      value={{ downloads, addDownload, favorites, addFavorites, setFavorites }}
    >
      {children}
    </DownloadContext.Provider>
  );
};

// export default Downloadscontext;
