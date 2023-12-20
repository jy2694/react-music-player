import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward, faPause, faPlay, faRepeat, faSlash } from '@fortawesome/free-solid-svg-icons';
import '../css/AudioPlayer.css';
import ReactPlayer from 'react-player';
import { useEffect, useRef, useState } from 'react';
import VolumeSlider from './VolumeSlider';
export default function AudioPlayer(props) {

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("")
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [progress, setProgress] = useState(0);
    const [repeat, setRepeat] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (props.url !== null && props.url !== undefined) {
            setUrl(props.url);
            if (props.url !== "") {
                setPlaying(true);
            }
        }
        if (props.title !== null && props.title !== undefined) {
            setTitle(props.title);
        }
        if (props.author !== null && props.author !== undefined) {
            setAuthor(props.author);
        }
        if (videoRef !== null) {
            videoRef.current.seekTo(0);
        }
    }, [props.url, props.title, props.author]);

    const onEnded = () => {
        if(repeat){
            setPlaying(false);
            restartAudio();
        } else {
            if (props.onEnded !== null && props.onEnded !== undefined) {
                props.onEnded();
            }
        }
    }
    
    function delay(ms=1000){
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function restartAudio() {
        await delay(250);
        setPlaying(true);
    }

    const forwardHandle = () => {
        videoRef.current.seekTo(videoRef.current.getCurrentTime() + 5);
    }

    const backwardHandle = () => {
        videoRef.current.seekTo(videoRef.current.getCurrentTime() - 5);
    }

    const getYoutubeID = () => {
        if (url !== "") {
            const parameters = url.split("?")[1].split("&");
            for (let i = 0; i < parameters.length; i++) {
                if (parameters[i].startsWith("v=")) {
                    return parameters[i].replace("v=", "");
                }
            }
        }
        return "";
    }

    return (
        <div className="player" {...props}>
            <div className={playing ? "cd-image run" : "cd-image"} style={{ backgroundImage: "url(https://img.youtube.com/vi/" + getYoutubeID() + "/maxresdefault.jpg)" }}>
                <div className="cd-image-inner" />
            </div>
            <div className="player-information-wrapper">
                <span className="title">{title}</span>
                <span className="author">{author}</span>
            </div>
            <div className="progressbar">
                <div className="progressbar-inner" style={{ width: (progress * 100) + "%" }}></div>
            </div>
            <div style={{ width: "80%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <VolumeSlider style={{ width: "50%" }} max={1} step={0.01} onChange={(value) => setVolume(value)} />
            </div>
            <div className="player-buttons-wrapper">
                <div className="button" onClick={backwardHandle}><FontAwesomeIcon icon={faBackward} /></div>
                <div className="button" onClick={() => {
                    if (url !== "") setPlaying(!playing)
                }}>
                    {playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </div>
                <div className="button" onClick={forwardHandle}><FontAwesomeIcon icon={faForward} /></div>
            </div>
            <div className="player-control-wrapper">
                <div style={{display: "flex", justifyContent:"center", alignItems: "center", margin: "1%"}} onClick={()=>setRepeat(!repeat)}>
                    <FontAwesomeIcon style={{ margin: "1%" }} icon={faRepeat} />
                    {!repeat && <FontAwesomeIcon style={{ margin: "1%", position: "absolute" }} icon={faSlash} />}
                </div>
            </div>
            <ReactPlayer
                ref={videoRef}
                style={{ display: "none" }}
                onProgress={(e) => setProgress(e.played)}
                url={url}
                playing={playing}
                onEnded={onEnded}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                pip={false}
                volume={volume} />
        </div>);
}