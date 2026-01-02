import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoriesService = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};

// ======================
// GET ALL CATEGORIES
// ======================
async function getCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/public-categories`, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error occurred while fetching product categories",
      error
    );
    throw error;
  }
}


// ======================
// ADD CATEGORY
// ======================
async function addCategory(
  data: { name: string },
  // token: string
) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/admin/public-categories`,
      data,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error occurred while adding category", error);
    throw error;
  }
}

// ======================
// UPDATE CATEGORY
// ======================
async function updateCategory(
  id: string,
  data: { name: string },
  // token: string
) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/public-categories/${id}`,
      data,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error occurred while updating category", error);
    throw error;
  }
}

// ======================
// DELETE CATEGORY
// ======================
async function deleteCategory(id: string,
  // token: string
) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/admin/public-categories/${id}`,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error occurred while deleting category", error);
    throw error;
  }
}
