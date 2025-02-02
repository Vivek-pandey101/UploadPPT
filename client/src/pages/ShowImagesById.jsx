import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ShowImagesById.module.css";
import { fetchImagesById, updateBoolean } from "../redux/action";
import Loader from "../component/Loader";

const ShowImagesById = () => {
  const { imageArrById, isLoading, imageArr } = useSelector(
    (state) => state.images
  );
  const { url = [], name } = imageArrById;

  const fetchId = localStorage.getItem("id");

  const dispatch = useDispatch();

  // Ensure `url` is always an array
  const urlArray = Array.isArray(url) ? url : url ? [url] : [];

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 1; // Set to show 1 image per page

  // Calculate the indexes for the current page
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = urlArray.slice(indexOfFirstImage, indexOfLastImage);

  useEffect(() => {
    if (fetchId) {
      dispatch(fetchImagesById(fetchId));
    }
  }, [fetchId]);

  const handleToUpdate = (urlLink, isChecked) => {
    // Find the matching _id from imageArr
    const imageIds = imageArr.map(image => image._id);
    // console.log(imageIds);

    if (!imageIds) {
      console.error("No matching _id found for this URL:", urlLink);
      return;
    }
    dispatch(
      updateBoolean({ id: imageIds, urlLink, isChecked: !isChecked })
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.ShowImagesByIdContainer}>
      <h2>{name}</h2>
      <div className={styles.ImagesWrapper}>
        {currentImages.map((image, index) => (
          <div key={index} className={styles.ImageCont}>
            <img src={image.link} alt={`Image ${index}`} />
            <input
              type="checkbox"
              checked={image.isChecked}
              onChange={() =>
                handleToUpdate(image.link, image.isChecked)
              }
            />
          </div>
        ))}
        <div className={styles.imageButtons}>
          {urlArray.map((_, index) => (
            <div key={index}>
              <button key={index} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowImagesById;
