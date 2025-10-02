import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import HomePage from "./components/HomePage/HomePage";
import SearchPage from "./components/SearchPage/SearchPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import Downloads from "./components/Downloads/Downloads";
import Favorites from "./components/Favorites/Favorites";
import "./App.css";
import { DownloadProvider } from "./Downloadscontext";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <DownloadProvider>
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results/:searchTerm" element={<SearchPage />} />
            <Route path="/categories/:category?" element={<CategoryPage />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/favorite" element={<Favorites />} />
          </Routes>
        </DownloadProvider>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
