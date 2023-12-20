import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/PlayList.css';
import { faAnglesRight, faPlus, faSortDown, faSortUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Modal from './Modal';
export default function PlayList(props) {

    const [show, setShow] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        if (props.playlist !== null && props.playlist !== undefined) {
            setPlaylist(props.playlist);
        }
    }, [props.playlist]);



    function renderPlaylistElement() {
        const plist = [];
        for (let i = 0; i < playlist.length; i++) {
            plist.push(<div key={i} className="playlist-element-wrapper">
                <div className="playlist-element-control">
                    <FontAwesomeIcon style={{cursor: "pointer"}} icon={faSortUp} onClick={()=>props.moveHigh(i)}/>
                    <FontAwesomeIcon style={{cursor: "pointer"}} icon={faSortDown} onClick={()=>props.moveLow(i)}/>
                </div>
                <div className="playlist-element">
                    <div className="playlist-element-inner">
                        <span className="title">{playlist[i].title}</span>
                        <span className="author">{playlist[i].author}</span>
                    </div>
                    <div className="playlist-element-buttons-wrapper">
                        <span className="url">{playlist[i].url}</span>
                        <div className="playlist-element-button">
                            <FontAwesomeIcon icon={faTrashCan} onClick={() => props.removeAudioTrack(i)} />
                        </div>
                    </div>
                </div>
            </div>);
        }
        return plist;
    }

    return (
        <>
            <div className={"playlist " + (show ? "playlist-open" : "playlist-close")}>
                <div className="playlist-title">
                    <span className="playlist-title-text">QUEUE</span>
                    <FontAwesomeIcon className="playlist-title-text" icon={faPlus} onClick={() => setShowModal(true)} />
                </div>
                <div className="playlist-body">
                    {renderPlaylistElement()}
                </div>
            </div>
            <div className={"playlist-visible-button " + (show ? "button-open" : "button-close")} onClick={() => setShow(!show)}>
                <FontAwesomeIcon className={show ? "button-text-open" : "button-text-close"} icon={faAnglesRight} />
            </div>
            <Modal style={showModal ? {} : { display: "none" }} setShowModal={(s) => setShowModal(s)} addAudioTrack={(data) => {
                props.addAudioTrack(data);
            }} />
        </>
    );
}