import { useState } from "react";
import "../components/HomePage/HomePage.css";
export default function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="lazy-wrapper">
      {!loaded && <div className="skeleton" />} {/* placeholder box */}
      <div className={`lazy ${loaded ? "visible" : ""}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => {
            setLoaded(true);
          }}
          className="img"
        />
      </div>
    </div>
  );
}
