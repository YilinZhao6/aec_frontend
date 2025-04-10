import axios from 'axios';

const API_URL = 'https://backend-ai-cloud-explains.onrender.com';

// File info and content
export const getFileInfo = async (userId, filename) => {
  try {
    const response = await axios.post(`${API_URL}/note/get_file_info`, {
      user_id: userId,
      filename
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching file info:', error);
    return { success: false, error: 'Failed to fetch file info' };
  }
};

export const saveFileContent = async (userId, filename, content) => {
  try {
    const response = await axios.post(`${API_URL}/note/save_file`, {
      user_id: userId,
      filename,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: 'Failed to save file' };
  }
};

// Folder operations
export const createFolder = async (userId, currentDirectory = '') => {
  try {
    const response = await axios.post(`${API_URL}/note/create_folder`, {
      user_id: userId,
      current_directory: currentDirectory
    });
    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    return { success: false, error: 'Failed to create folder' };
  }
};

export const renameFolder = async (userId, currentDirectory, newName) => {
  try {
    const response = await axios.post(`${API_URL}/note/rename_folder`, {
      user_id: userId,
      current_directory: currentDirectory,
      new_name: newName
    });
    return response.data;
  } catch (error) {
    console.error('Error renaming folder:', error);
    return { success: false, error: 'Failed to rename folder' };
  }
};

export const deleteFolder = async (userId, directory) => {
  try {
    const response = await axios.post(`${API_URL}/note/delete_folder`, {
      user_id: userId,
      directory
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting folder:', error);
    return { success: false, error: 'Failed to delete folder' };
  }
};

// File operations
export const createFile = async (userId, currentDirectory = '') => {
  try {
    const response = await axios.post(`${API_URL}/note/create_file`, {
      user_id: userId,
      current_directory: currentDirectory
    });
    return response.data;
  } catch (error) {
    console.error('Error creating file:', error);
    return { success: false, error: 'Failed to create file' };
  }
};

export const renameFile = async (userId, currentFilename, newName) => {
  try {
    const response = await axios.post(`${API_URL}/note/rename_file`, {
      user_id: userId,
      current_filename: currentFilename,
      new_name: newName
    });
    return response.data;
  } catch (error) {
    console.error('Error renaming file:', error);
    return { success: false, error: 'Failed to rename file' };
  }
};

export const deleteFile = async (userId, directory) => {
  try {
    const response = await axios.post(`${API_URL}/note/delete_files`, {
      user_id: userId,
      directory
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: 'Failed to delete file' };
  }
};

// Note tree and structure
export const getUserNoteTree = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/note/get_user_note_tree`, {
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user note tree:', error);
    return { success: false, error: 'Failed to get note tree' };
  }
};

// Concept and explanation operations
export const generateConceptExplanation = async (userId, filename, concept, occurrence = 1, mode = 'fast') => {
  try {
    const response = await axios.post(`${API_URL}/note/generate_concept_explanation`, {
      user_id: userId,
      filename,
      concept,
      occurrence,
      mode
    });
    return response.data;
  } catch (error) {
    console.error('Error generating explanation:', error);
    return { success: false, tag: '', explanation: '', message: 'Failed to generate explanation' };
  }
};

export const getExplanationsPerConcept = async (userId, filename) => {
  try {
    const response = await axios.post(`${API_URL}/note/get_explanation_per_concept`, {
      user_id: userId,
      filename
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching explanations:', error);
    return { success: false, explanations: [] };
  }
};