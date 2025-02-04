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
  const [localUrls, setLocalUrls] = useState([]);

  const dispatch = useDispatch();
  const fetchId = localStorage.getItem("id");
  const userEmail = JSON.parse(localStorage.getItem("userCred"));

  // Ensure `url` is always an array
  useEffect(() => {
    const urlArray = Array.isArray(url) ? url : url ? [url] : [];
    setLocalUrls(urlArray);
  }, [url]);

  useEffect(() => {
    if (fetchId) {
      dispatch(fetchImagesById(fetchId));
    }
  }, [fetchId, dispatch]);

  const handleToUpdate = async (urlLink, email, index, docName) => {
    const istTime = new Date().toISOString();
    const timestamp = new Date(istTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const userName = userEmail?.name;
    const updatedUrls = localUrls.map((item) => {
      if (item.link === urlLink) {
        const isChecked = item.isChecked.includes(email)
          ? item.isChecked.filter((e) => e !== email)
          : [...item.isChecked, email];
        return {
          ...item,
          isChecked,
          actionTimestamp: timestamp,
          clickedIndex: index + 1,
          userName,
          userEmail: email,
          docName,
        };
      }
      return item;
    });
    setLocalUrls(updatedUrls);

    try {
      dispatch(
        updateBoolean({
          id: fetchId,
          urlLink,
          isCheckedForEmail: email,
          actionTimestamp: timestamp,
          clickedIndex: index + 1,
          userName,
          docName,
        })
      );
    } catch (err) {
      console.error("Update failed, rolling back", err);
      setLocalUrls(url); // Rollback on error
    }
    setShow(false);
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
    if (currentPage < localUrls.length) {
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
          {localUrls.length > 0 && (
            <img
              src={localUrls[currentPage - 1].link}
              alt={`Image ${currentPage}`}
            />
          )}
          <input
            type="checkbox"
            checked={localUrls[currentPage - 1]?.isChecked?.includes(
              userEmail.email
            )}
            onChange={() =>
              handleToUpdate(
                localUrls[currentPage - 1].link,
                userEmail.email,
                currentPage - 1,
                name
              )
            }
          />
          <button className={styles.fullScreenBtn} onClick={toggleFullScreen}>
            {show ? <MdFullscreenExit size={30} /> : <BsFullscreen />}
          </button>
          {showFullScreen ? (
            <div className={styles.fullScreenNav}>
              <button onClick={handlePrev} disabled={currentPage === 1}>
                <BsChevronLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === localUrls.length}
              >
                <BsChevronRight />
              </button>
            </div>
          ) : null}
        </div>

        <div className={styles.imageButtons}>
          {localUrls.map((_, index) => (
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
            disabled={currentPage === localUrls.length}
          >
            <BsChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowImagesById;
