import React, { useEffect, useState } from "react";
import styles from "./TeachersList.module.css";
import { ImCross } from "react-icons/im";

const TeachersList = ({ setShow, show, selectedFileId }) => {
  const [users, setUsers] = useState([]);
  const [enabled, setEnabled] = useState([]);

  // Fetch enabled users when selectedFileId changes
  useEffect(() => {
    const fetchEnabledUsers = async () => {
      if (!selectedFileId) return;
      try {
        const response = await fetch(
          `http://localhost:3000/fetchall/${selectedFileId}`
        );
        const { image } = await response.json();
        const {enabledUser} = image
        // console.log(enabledUser);
        setEnabled(enabledUser || []);
      } catch (err) {
        console.error("Error fetching enabled users:", err);
      }
    };
    fetchEnabledUsers();
  }, [selectedFileId]);

  // Fetch all users (non-admin)
  useEffect(() => {
    const getUserList = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/register/getAllUsers"
        );
        const { images } = await response.json();
        setUsers(images);
      } catch (err) {
        console.log(err);
      }
    };
    getUserList();
  }, []);

  const handleCheckboxChange = async (email, isChecked) => {
    try {
      const response = await fetch(
        `http://localhost:3000/files/${selectedFileId}/enableUser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, enable: isChecked }),
        }
      );

      if (response.ok) {
        const { file } = await response.json();
        setEnabled(file.enabledUser); // Update enabled users after change
      } else {
        console.error("Failed to update enabled user");
      }
    } catch (err) {
      console.error("Error updating enabled user:", err);
    }
  };

  return (
    <div
      className={styles.TeachersListContainer}
      onClick={() => setShow(!show)}
    >
      <div className={styles.ContainerTwo} onClick={(e) => e.stopPropagation()}>
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Email</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => !user.isAdmin)
                .map((user) => (
                  <tr key={user._id} className={styles.tableRow}>
                    <td className={styles.tableData}>{user.name}</td>
                    <td className={styles.tableData}>{user.email}</td>
                    <td className={styles.tableData}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        onChange={(e) =>
                          handleCheckboxChange(user.email, e.target.checked)
                        }
                        checked={enabled.includes(user.email)} // Correct condition
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <button
          className={styles.CrossBtn}
          onClick={() => setShow(!show)}
          aria-label="Close"
        >
          <ImCross />
        </button>
      </div>
    </div>
  );
};

export default TeachersList;
