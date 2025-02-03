import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for uploading images
export const uploadImages = createAsyncThunk(
  "images/uploadImages",
  async ({ name, selectedFiles }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("name", name);
    for (const file of selectedFiles) {
      formData.append("s3Images", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData
      );
      if (response.status === 200) {
        return response.data; // Assume the response contains the success message or updated data
      }
      return rejectWithValue("Failed to upload images.");
    } catch (error) {
      return rejectWithValue("An error occurred while uploading images.");
    }
  }
);

// Async thunk for fetching images
export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/fetchall");
      if (response.status === 200) {
        return response.data.images; // Assuming the response contains an array of images
      }
      return rejectWithValue("Failed to fetch images.");
    } catch (error) {
      return rejectWithValue("An error occurred while fetching images.");
    }
  }
);

export const fetchImagesById = createAsyncThunk(
  "images/fetchImagesById", // Use unique action type
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/fetchall/${id}`);
      if (response.status === 200) {
        return response.data.image; // Assuming `image` contains the fetched image
      }
      return rejectWithValue("Failed to fetch image.");
    } catch (error) {
      return rejectWithValue("An error occurred while fetching image.");
    }
  }
);

export const updateBoolean = ({ id, urlLink, isCheckedForEmail }) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/${id}/updateBoolean`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, urlLink, isCheckedForEmail }),
    });

    const data = await response.json();

    if (data.success) {
      dispatch({ type: "UPDATE_BOOLEAN_SUCCESS", payload: data.document });
    }
  } catch (error) {
    console.error("Error updating boolean value:", error);
  }
};


const initialState = {
  imageArr: [],
  imageArrById: [],
  isLoading: false,
  uploadError: "",
  fetchError: "",
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle the upload images async actions
    builder
      .addCase(uploadImages.pending, (state) => {
        state.isLoading = true;
        state.uploadError = "";
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageArr = action.payload.images || state.imageArr;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.isLoading = false;
        state.uploadError =
          action.payload || "An error occurred while uploading images.";
      })
      // Handle the fetch images async actions
      .addCase(fetchImages.pending, (state) => {
        state.isLoading = true;
        state.fetchError = "";
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageArr = action.payload || [];
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError =
          action.payload || "An error occurred while fetching images.";
      })
      // Handle the fetch images by ID async actions (unique action type)
      .addCase(fetchImagesById.pending, (state) => {
        state.isLoading = true;
        state.fetchError = "";
      })
      .addCase(fetchImagesById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageArrById = action.payload || {}; // Store the fetched image
      })
      .addCase(fetchImagesById.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError =
          action.payload || "An error occurred while fetching image by ID.";
      });
  },
});

export const { actions, reducer: imagesReducer } = imageSlice;
