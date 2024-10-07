import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import styles from "./VideoPlayer.module.css";

const VideoPlayer = ({ videoUrl, initialPlaying = false, initialMuted = false, initialVolume = 0.8 }) => {
  const [playing, setPlaying] = useState(initialPlaying);
  const [muted, setMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(initialVolume);
  const [played, setPlayed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const playerRef = useRef(null);

  const videoHandler = (control, state) => {
    switch (control) {
      case "PlayPause":
        setPlaying(!playing);
        if (!playing) setControlsVisible(false);
        break;
      case "SeekChange":
        setPlayed(parseFloat(state.target.value));
        playerRef.current.seekTo(parseFloat(state.target.value));
        break;
      case "Mute":
        setMuted(!muted);
        break;
      case "VolumeChange":
        setVolume(parseFloat(state.target.value));
        break;
      case "ShowControls":
        setControlsVisible(true);
        break;
      case "HideControls":
        if (playing) setControlsVisible(false);
        break;
      case "handleProgress":
        setPlayed(state.played);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.videoWrapper} onMouseEnter={() => videoHandler("ShowControls")} onMouseLeave={() => videoHandler("HideControls")}>
      <ReactPlayer ref={playerRef} url={`${videoUrl}#t=0`} playing={playing} muted={muted} volume={volume} onProgress={state => videoHandler("handleProgress", state)} height="100%" width="100%" controls={false} />
      <div className={`${styles.controls} ${!controlsVisible && styles.hidden}`}>
        <button onClick={() => videoHandler("PlayPause")}>{playing ? <FaPause /> : <FaPlay />}</button>
        <input className={styles.slider} type="range" min={0} max={1} step="any" value={played} onChange={e => videoHandler("SeekChange", e)} style={{ width: "80%" }} />
        <button onClick={() => videoHandler("Mute")}>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
        <input className={styles.slider} type="range" min={0} max={1} step="any" value={volume} onChange={e => videoHandler("VolumeChange", e)} style={{ width: "10%" }} />
      </div>
    </div>
  );
};

export default VideoPlayer;
