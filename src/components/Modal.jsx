import { useEffect, useState } from 'react';
import '../css/Modal.css';
export default function Modal(props){

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [loading, setLoading]= useState(false);
    const [firstInput, setFirstInput] = useState(false);

    function delay(ms=1000){
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const getYoutubeID = () => {
        if(url !== ""){
            const parameters = url.split("?")[1].split("&");
            for(let i = 0; i < parameters.length; i ++){
                if(parameters[i].startsWith("v=")){
                    return parameters[i].replace("v=", "");
                }
            }
        }
        return "";
    }
    const addAudioTrack = () => {
        if(title === "" || author === "" || url === "" || thumbnail === ""){
            return;
        }
        props.addAudioTrack({title: title, author: author, url: url});
        props.setShowModal(false);
    }
    const cancel = () => {
        props.setShowModal(false);
    }
    async function getUrlData(nowUrl){
        try{
            setLoading(true);
            await delay(500);
            if(nowUrl !== url) return;
            const response = await fetch("https://noembed.com/embed?url="+url);
            const data = await response.json();
            setTitle(data.title.trim());
            setAuthor(data.author_name.trim());
            setThumbnail("url(https://img.youtube.com/vi/"+getYoutubeID()+"/maxresdefault.jpg)");
            setLoading(false);
        } catch{
            setTitle("");
            setAuthor("");
            setThumbnail("url(https://img.youtube.com/vi//maxresdefault.jpg)")
        }
    }
    useEffect(()=>{
        getUrlData(url);
    }, [url]);

    return (
        <>
        <div className="modal" {...props}>
            <div className="header">
                Add Audio Track
            </div>
            <div className="body">
                <span>Input youtube video address.</span>
                <input type="text" value={url} onChange={(e)=>{
                    if(!firstInput)setFirstInput(true);
                    setUrl(e.target.value);
                }}/>
                {loading && firstInput && <span class="loader"/>}
                {!loading && firstInput && <div className="result">
                    <div className="thumbnail" style={{backgroundImage: thumbnail}}/>
                    <div className="description">
                        <span>TITLE : </span>
                        <span>{title}</span>
                        <span> AUTHOR : </span>
                        <span>{author}</span>
                    </div>
                </div>}
            </div>
            <div className="footer">
                <button onClick={cancel}>CANCEL</button>
                <button onClick={addAudioTrack}>ADD</button>
            </div>
        </div>
        </>
    );
}