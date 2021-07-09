import React, { useState, useEffect } from "react";

//fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faAngleLeft, faAngleRight, faPause} from "@fortawesome/free-solid-svg-icons";



const Player = ({ audioRef, currentSong, isPlaying, setIsPlaying, setSongInfo, songInfo, songs, setCurrentSong, setSongs}) => {
    useEffect( () => {
        const newSongs = songs.map((song) => {
            if (song.id === currentSong.id) {
                return { ...song, active: true };
            }
            else {
                return { ...song, active: false }
            }
        })
        //is playing?
        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then((audio) => {
                    audioRef.current.play();
                });
            }
        }
        setSongs(newSongs);
    }, [currentSong]);

    //EVENT HANDLERS
    const playSongHandler = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(!isPlaying);
        }
        else {
            audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const getTime = time => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        const secondsWithZero = String(seconds).padStart(2, "0")
        return `${minutes}:${secondsWithZero}`
    }

    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({
            ...songInfo,
            currentTime: e.target.value
        })
    };

    const skipTrackHandler = (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

        if (direction==='skip-forward') {
            setCurrentSong( songs[(currentIndex + 1) % songs.length]);
        }

        else if (direction === 'skip-back'){
            
            if ((currentIndex - 1) % songs.length === -1) {
                setCurrentSong(songs[songs.length-1]);
            }
            else{
                setCurrentSong(songs[(currentIndex - 1) % songs.length]);
            }
        }
        
    };

    //styling consts
    const trackAnim = {
        transform : `translateX(${songInfo.animationPercentage}%)`
    }
    const backLinGrad = {
        background : `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`
    }
    
    return (
        //JSX
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>

                <div style={backLinGrad}className="track">
                    <input
                        min={0}
                        max={songInfo.duration || 0 }
                        value={songInfo.currentTime}
                        onChange={dragHandler}
                        type="range"
                    />

                    <div style={trackAnim} className="animate-track">

                    </div>
                </div>



                <p>{getTime( songInfo.duration || 0 )}</p>
            </div>

            <div className="play-control">
                
                {/* Skip Back */}
                <FontAwesomeIcon 
                    onClick={ ()=> skipTrackHandler('skip-back')}
                    className="skip-back" 
                    size="2x" 
                    icon={faAngleLeft} 
                />
                
                {/* Play/pause */}
                <FontAwesomeIcon 
                    onClick={playSongHandler} 
                    className="play" 
                    size="2x" 
                    icon={isPlaying ? faPause : faPlay} 
                />

                {/* Skip Forward */}
                <FontAwesomeIcon 
                    onClick={() => skipTrackHandler('skip-forward')}
                    className="skip-forward" 
                    size="2x" 
                    icon={faAngleRight} 
                />

            </div>
        </div>
    );
};

export default Player;