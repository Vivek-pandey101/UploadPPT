import React, { useState } from "react";
import styles from "./GalleryPage.module.css";
import TeachersList from "./TeachersList";

const GalleryPage = ({ images }) => {
  const [show, setShow] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFileIdTwo, setSelectedFileIdTwo] = useState(null);

  const handleAssignTodaysTask = (fileId) => {
    setSelectedFileId(fileId);
    setShow(true);
  };

  return (
    <>
      <div className={styles.galleryTableWrapper}>
        <table className={styles.galleryTable}>
          <thead>
            <tr>
              <th>Image Name</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images?.map((item, index) => (
              <tr key={index} className={styles.galleryRow}>
                <td className={styles.imageNameCell}>{item.name}</td>
                <td className={styles.actionsCell}>
                  <p className={styles.seeImagesButton}>{item._id}</p>
                  <button
                    className={styles.assignTodayButton}
                    onClick={() => handleAssignTodaysTask(item._id)}
                  >
                    Assign today's task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <TeachersList
          setShow={setShow}
          show={show}
          selectedFileId={selectedFileId}
        />
      )}
    </>
  );
};

export default GalleryPage;
