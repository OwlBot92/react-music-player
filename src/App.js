import React, { useState, useRef } from "react";
//import Style
import "./styles/app.scss";

//adding components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";

//import Data
import data from './data';



function App() {
	//REF
	const audioRef = useRef(null);
	//state
	const [songs, setSongs] = useState(data());
	const [currentSong, setCurrentSong] = useState(songs[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [songInfo, setSongInfo] = useState({
		currentTime: 0,
		duration: 0,
		animationPercentage: 0,
	});
	const [libraryStatus, setLibraryStatus] = useState(false);


	const timeUpdateHandler = (e) => {
		const current = e.target.currentTime;
		const duration = e.target.duration;
		//percentage
		const roundedCurrent = Math.round(current);
		const roundedDuration = Math.round(duration);

		const animation = Math.round((roundedCurrent / roundedDuration) * 100);

		setSongInfo({
			...songInfo,
			currentTime: current,
			duration: duration,
			animationPercentage: animation,
		})
	};

	//per lo skip automatico quando finisce una canzone
	const songEndHandler = async() => {
		let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
		await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
		if (isPlaying) audioRef.current.play();
	};

	

	return (
		<div className={`App ${libraryStatus ? "library-active" : ""}`}>
			<Nav 
				/* PROPS */
				libraryStatus={libraryStatus} 
				setLibraryStatus={setLibraryStatus}
			/>

			<Song 
				/* PROPS */
				currentSong={currentSong} 
			/>

			<Player
				/* PROPS */
				audioRef={audioRef}
				isPlaying={isPlaying}
				setIsPlaying={setIsPlaying}
				currentSong={currentSong}
				setSongInfo={setSongInfo}
				songInfo={songInfo}
				songs={songs}
				setCurrentSong={setCurrentSong}
				setSongs={setSongs}
			/>

			<Library 
				/* PROPS */
				audioRef={audioRef} 
				songs={songs} 
				setCurrentSong={setCurrentSong} 
				isPlaying={isPlaying} 
				setSongs={setSongs}
				libraryStatus={libraryStatus}
			/>

			<audio
				onTimeUpdate={timeUpdateHandler}
				onLoadedMetadata={timeUpdateHandler}
				ref={audioRef}
				src={currentSong.audio}
				onEnded={ ()=>songEndHandler() }
			>

			</audio>
		</div>
	);
}

export default App;
