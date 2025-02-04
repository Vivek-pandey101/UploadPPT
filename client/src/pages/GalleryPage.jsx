import React, { useState } from "react";
import styles from "./GalleryPage.module.css";
import TeachersList from "./TeachersList";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const GalleryPage = ({ images }) => {
  const [show, setShow] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const handleAssignTodaysTask = (fileId) => {
    setSelectedFileId(fileId);
    setShow(true);
  };

  const deleteDocument = async (id) => {
    const isConfirmed = window.confirm("Are you sure want to delete?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/delete/${id}`
        );
        console.log("Document deleted successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error deleting document:",
          error.response?.data || error.message
        );
        return { success: false, error: error.message };
      }
    }
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
                  <button
                    className={styles.deleteBTN}
                    onClick={() => deleteDocument(item._id)}
                  >
                    <FaTrashAlt size={25} />
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
