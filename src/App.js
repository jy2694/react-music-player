import logo from './logo.svg';
import './App.css';

import AudioPlayer from './components/AudioPlayer';
import PlayList from './components/PlayList';
import { useEffect, useState } from 'react';

function App() {

  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    console.log(playing);
    if (!playing) {
      playFirst();
    }
  }, [playing]);

  const playFirst = () => {
    if (playlist.length > 0) {
      setPlaying(true);
      setUrl(playlist[0].url);
      setTitle(playlist[0].title);
      setAuthor(playlist[0].author);
      setPlaylist(playlist.slice(1));
    }
  }

  const moveHigh = (idx) => {
    if(idx <= 0) return;
    const newPlaylist = [];
    for(let i = 1; i < playlist.length; i ++){
      if(i === idx){
        newPlaylist.push(playlist[i]);
        newPlaylist.push(playlist[i-1]);
      } else if(i !== idx-1){
        newPlaylist.push(playlist[i]);
      }
    }
    setPlaylist(newPlaylist);
  }

  const moveLow = (idx) => {
    if(idx >= playlist.length-1) return;
    const newPlaylist = [];
    for(let i = 0; i < playlist.length-1; i ++){
      if(i === idx){
        newPlaylist.push(playlist[i+1]);
        newPlaylist.push(playlist[i]);
      } else if(i !== idx+1){
        newPlaylist.push(playlist[i]);
      }
    }
    setPlaylist(newPlaylist);
  }

  useEffect(() => {
    fetch("https://noembed.com/embed?url=https://www.youtube.com/watch?v=nRkVARswFIY")
      .then(res => res.json().then(data => console.log(data)));
  }, []);

  return (
    <div className="App">
      <div className="player-wrapper">
        <AudioPlayer url={url} title={title} author={author} onEnded={() => setPlaying(false)} />
      </div>
      <PlayList
        playlist={playlist}
        addAudioTrack={(data) => {
          if (!playing) {
            setPlaying(true);
            setUrl(data.url);
            setTitle(data.title);
            setAuthor(data.author);
          } else {
            setPlaylist([...playlist, data]);
          }
        }} 
        removeAudioTrack={(targetIndex) => {
          const newPlaylist = [];
          for(let i = 0; i < playlist.length; i ++){
            if(i !== targetIndex){
              newPlaylist.push(playlist[i]);
            }
          }
          setPlaylist(newPlaylist);
        }}
        moveHigh={moveHigh}
        moveLow={moveLow}/>
    </div>
  );
}

export default App;
