import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const ALLOWED_TYPES = [".txt", ".jpg", ".jpeg", ".png", ".json"];

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}list/`);
      setFiles(response.data);
    } catch (error) {
      setError("Error fetching files");
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const validateFileType = (file) => {
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    return ALLOWED_TYPES.includes(fileExtension);
  };

  const handleFileSelect = (e) => {
    setError("");
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    if (!validateFileType(selectedFile)) {
      setError(`Please upload only ${ALLOWED_TYPES.join(", ")} files`);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`${API_URL}upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedFile(null);
      setError("");
      fetchFiles(); // Refresh the file list instead of page reload
    } catch (error) {
      setError("Error uploading file");
      console.error("Error uploading file:", error);
    }
  };

  const FileList = () => (
    <ul>
      {files.map((file) => (
        <li key={file.id}>
          <a
            href={`${import.meta.env.VITE_API_URL}${file.file}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.file.split("/").pop()}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h2>File Upload</h2>
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
        />
        <button type="submit">Upload</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Uploaded Files</h3>
      <FileList />
    </div>
  );
};

export default FileUpload;
