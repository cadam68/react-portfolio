import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // To render HTML tags within Markdown content using react-markdown, you need to enable HTML rendering by using the rehype-raw plugin
import "./MarkdownStyles.css";
import { FetchService } from "../../services/FetchService";

const MarkdownDisplay = ({ filePath }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      const markdownContent = await FetchService().getMarkdownFile(filePath);
      setContent(markdownContent);
    };

    loadContent();
  }, [filePath]);

  return (
    <div className="markdown-content">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
