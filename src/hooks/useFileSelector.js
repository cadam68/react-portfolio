import { useRef, useState } from "react";

/* usage
   -----
  const { createFileSelector } = useFileSelector();
  const [fileSelector] = useState(() =>
    createFileSelector(['.pdf', '.docx', '.txt'], 200, 'Upload a Document')
  );
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!fileSelector.selectedFile) { ... }
    fileSelector.clearFile());
  }
  return (
    <form onSubmit={handleSubmit}>
      {fileSelector.FileSelectorComponent()}
      <button type="submit">Submit</button>
    </form>
  );
 */
const useFileSelector = () => {
  const createFileSelector = (documentAllowedExtensions, documentMaxSize, buttonText = "Select a File") => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorUpload, setErrorUpload] = useState("");

    const handleFileChange = event => {
      const file = event.target.files[0];

      if (file) {
        const isValidFileType = documentAllowedExtensions.some(fileExtension => file.name.endsWith(fileExtension));
        if (file.size > documentMaxSize * 1024) {
          setErrorUpload(`File size exceeds the maximum limit of ${documentMaxSize} KB`);
          setSelectedFile(null);
        } else if (!isValidFileType) {
          setErrorUpload(`Invalid file type. Only ${documentAllowedExtensions.join(", ")} documents are allowed`);
          setSelectedFile(null);
        } else {
          setSelectedFile(file);
          setErrorUpload("");
          event.target.value = null;
        }
      }
    };

    const handleSelectFile = () => {
      fileInputRef.current.click();
    };

    const clearFile = () => {
      setSelectedFile(null);
      setErrorUpload("");
    };

    const FileSelectorComponent = () => (
      <div className="inline-form">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" onClick={handleSelectFile}>
            {buttonText}
          </button>
          <span className="input">{selectedFile?.name || "No file selected"}</span>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        </div>
        {errorUpload && <div className="error-message">{errorUpload}</div>}
      </div>
    );

    return {
      FileSelectorComponent,
      selectedFile,
      setSelectedFile,
      clearFile,
    };
  };

  return { createFileSelector };
};

export default useFileSelector;
