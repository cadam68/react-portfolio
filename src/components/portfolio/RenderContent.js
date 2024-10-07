import VideoPlayer from "./VideoPlayer";
import styles from "./RenderContent.module.css";
import React from "react";
import MarkdownDisplay from "./MarkdownDisplay";
import CarouselPlayer from "./CarouselPlayer";

const RenderContent = ({ item, style = "" }) => {
  if (!item) return null;

  switch (item.type) {
    case "video":
      return (
        <div className={`${styles.mainContent} ${styles.center} ${style ?? ""}`}>
          <h1>{item.label}</h1>
          <div className={"content-style"}>
            <VideoPlayer videoUrl={item.url} />
          </div>
        </div>
      );
    case "card":
      return (
        <div className={`${styles.mainContent} ${style ?? ""}`}>
          <MarkdownDisplay filePath={item.url} />
        </div>
      );
    case "carousel":
      return (
        <div className={`${styles.mainContent} ${styles.center} ${style ?? ""}`}>
          <h1>{item.label}</h1>
          <div className={"content-style"}>
            <CarouselPlayer images={item.data} showButtons={false} speed={6} />
          </div>
        </div>
      );
    default:
      return <div>Unsupported content type</div>;
  }
};

export default RenderContent;
