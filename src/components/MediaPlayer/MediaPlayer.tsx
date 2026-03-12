import { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Maximize2, Minimize2 } from 'lucide-react';
import type { MediaFile } from '../../types';
import { formatDuration } from '../../utils/helpers';
import './MediaPlayer.css';

interface MediaPlayerProps {
  file: MediaFile | null;
  onClose: () => void;
  onProgressUpdate: (progress: number) => void;
}

export default function MediaPlayer({ file, onClose, onProgressUpdate }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isVideo = file?.type === 'video';

  useEffect(() => {
    if (file) {
      if (isVideo && videoRef.current) {
        videoRef.current.load();
        setIsPlaying(true);
      } else if (!isVideo && audioRef.current) {
        audioRef.current.load();
        setIsPlaying(true);
      }
      setCurrentTime(0);
    }
  }, [file, isVideo]);

  useEffect(() => {
    const media = isVideo ? videoRef.current : audioRef.current;
    if (media) {
      if (isPlaying) {
        media.play();
      } else {
        media.pause();
      }
    }
  }, [isPlaying, isVideo]);

  const handleTimeUpdate = () => {
    const media = isVideo ? videoRef.current : audioRef.current;
    if (media) {
      setCurrentTime(media.currentTime);
      const progress = (media.currentTime / media.duration) * 100;
      onProgressUpdate(progress);
    }
  };

  const handleLoadedMetadata = () => {
    const media = isVideo ? videoRef.current : audioRef.current;
    if (media) {
      setDuration(media.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    const media = isVideo ? videoRef.current : audioRef.current;
    if (media) {
      media.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) videoRef.current.volume = vol;
    if (audioRef.current) audioRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    if (audioRef.current) audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skip = (seconds: number) => {
    const media = isVideo ? videoRef.current : audioRef.current;
    if (media) {
      media.currentTime += seconds;
    }
  };

  if (!file) return null;

  const isImage = file.type === 'image';

  return (
    <div className={`media-player ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="player-header">
        <h3 className="player-title">{file.name}</h3>
        <div className="player-controls-header">
          {!isImage && (
            <button className="player-btn" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          )}
          <button className="player-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="player-media">
        {isImage ? (
          <img src={file.url} alt={file.name} className="image-viewer" />
        ) : isVideo ? (
          <video
            ref={videoRef}
            src={file.url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="audio-visualizer">
            <div className="visualizer-ring" />
            <audio
              ref={audioRef}
              src={file.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>

      {!isImage && (
        <div className="player-progress">
          <span className="time">{formatDuration(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="progress-slider"
          />
          <span className="time">{formatDuration(duration)}</span>
        </div>
      )}

      {!isImage && (
        <div className="player-controls">
          <div className="controls-left">
            <button className="player-btn" onClick={() => skip(-10)}>
              <SkipBack size={20} />
            </button>
          </div>

          <div className="controls-center">
            <button 
              className="play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>

          <div className="controls-right">
            <button className="player-btn" onClick={() => skip(10)}>
              <SkipForward size={20} />
            </button>
            <div className="volume-control">
              <button className="player-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
