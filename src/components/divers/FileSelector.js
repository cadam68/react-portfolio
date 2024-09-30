import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";

/*
  Usage with ref :
  ----------------
  const fileSelectorRef = useRef(null);
  const handleSubmit = (event) => {
    const selectedFile = fileSelectorRef.current?.selectedFile;
    fileSelectorRef.current.clear();
  };
  <FileSelector ref={fileSelectorRef} documentAllowedExtensions={["jpg", "png"]} documentMaxSize={200} />

  Usage without ref :
  ----------------
  const [file, setFile] = useState(null);
  const handleFileSelect = file => {
    setFile(file);
   }
  <FileSelector documentAllowedExtensions={["jpg", "png"]} documentMaxSize={200} onFileSelect={handleFileSelect} />
 */
const FileSelector = forwardRef(({ documentAllowedExtensions, documentMaxSize, onFileSelect, disabled = false, showSelectedFile = true, buttonText = "Select a File" }, ref) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorUpload, setErrorUpload] = useState("");

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const isValidFileType = documentAllowedExtensions.some(fileExtension => file.name.endsWith(fileExtension));
      if (!isValidFileType) {
        setErrorUpload(`${file.name} file type in invalid. Only ${documentAllowedExtensions.join(", ")} documents are allowed`);
        setSelectedFile(null);
        if (onFileSelect) {
          onFileSelect(null); // Notify parent about invalid file
        }
      } else {
        if (file.size > documentMaxSize * 1024) {
          setErrorUpload(`${file.name} file size exceeds the maximum limit of ${documentMaxSize} KB`);
          setSelectedFile(null);
          if (onFileSelect) {
            onFileSelect(null); // Notify parent about invalid file
          }
        } else {
          setSelectedFile(file);
          setErrorUpload("");
          if (onFileSelect) {
            onFileSelect(file); // Notify parent about valid file selection
          }
          event.target.value = null;
        }
      }
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  // Expose methods and the selected file to the parent component via the ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      setSelectedFile(null);
      setErrorUpload("");
    },
    selectedFile, // Expose the selected file to the parent
  }));

  const showErrorText = documentAllowedExtensions || documentMaxSize;

  return (
    <div className="inline-form">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button disabled={disabled} type="button" onClick={handleSelectFile}>
          {buttonText}
        </button>
        {showSelectedFile && <span className="input">{selectedFile?.name || "No file selected"}</span>}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
      </div>
      {showErrorText && <div className="error">{errorUpload}&nbsp;</div>}
    </div>
  );
});

export default FileSelector;
