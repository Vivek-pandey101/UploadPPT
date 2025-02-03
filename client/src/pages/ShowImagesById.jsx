import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ShowImagesById.module.css";
import { fetchImagesById, updateBoolean } from "../redux/action";
import Loader from "../component/Loader";
import { BsFullscreen, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MdFullscreenExit } from "react-icons/md";

const ShowImagesById = () => {
  const { imageArrById, isLoading, imageArr } = useSelector(
    (state) => state.images
  );
  const { url = [], name } = imageArrById;
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const fetchId = localStorage.getItem("id");
  const userEmail = JSON.parse(localStorage.getItem("userCred"));

  // Ensure `url` is always an array
  const urlArray = Array.isArray(url) ? url : url ? [url] : [];

  useEffect(() => {
    if (fetchId) {
      dispatch(fetchImagesById(fetchId));
    }
  }, [fetchId, dispatch]);

  const handleToUpdate = (urlLink, email) => {
    const imageIds = imageArr.map((image) => image._id);
    if (!imageIds) {
      console.error("No matching _id found for this URL:", urlLink);
      return;
    }
    dispatch(
      updateBoolean({ id: imageIds, urlLink, isCheckedForEmail: email })
    );

    setTimeout(() => {
      dispatch(fetchImagesById(fetchId));
      setShow(false);
    }, 500);
  };

  const toggleFullScreen = () => {
    const imgElement = document.getElementById("present");
    if (!document.fullscreenElement) {
      imgElement.requestFullscreen();
      setShowFullScreen(true);
      setShow(true);
    } else {
      document.exitFullscreen();
      setShowFullScreen(false);
      setShow(false);
    }
  };

  const handleNext = () => {
    if (currentPage < urlArray.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.ShowImagesByIdContainer}>
      <h2>{name}</h2>
      <div className={styles.ImagesWrapper}>
        <div id="present" className={styles.ImageCont}>
          {urlArray.length > 0 && (
            <img
              src={urlArray[currentPage - 1].link}
              alt={`Image ${currentPage}`}
            />
          )}
          {!show && (
            <input
              type="checkbox"
              checked={urlArray[currentPage - 1]?.isChecked?.includes(
                userEmail.email
              )}
              onChange={() =>
                handleToUpdate(urlArray[currentPage - 1].link, userEmail.email)
              }
            />
          )}
          <button className={styles.fullScreenBtn} onClick={toggleFullScreen}>
            {show ? <MdFullscreenExit /> : <BsFullscreen />}
          </button>
          {showFullScreen ? (
            <div className={styles.fullScreenNav}>
              <button onClick={handlePrev} disabled={currentPage === 1}>
                <BsChevronLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === urlArray.length}
              >
                <BsChevronRight />
              </button>
            </div>
          ) : null}
        </div>

        <div className={styles.imageButtons}>
          {urlArray.map((_, index) => (
            <div key={index}>
              <button
                className={currentPage === index + 1 ? styles.activeBtn : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Navigation */}
      {showFullScreen && (
        <div className={styles.fullScreenNav}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            <BsChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === urlArray.length}
          >
            <BsChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowImagesById;
