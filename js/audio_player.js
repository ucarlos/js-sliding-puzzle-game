/*
 * ------------------------------------------------------------------------------
 * Created by Ulysses Carlos on 01/18/2024 at 11:15 PM
 *
 * audio_player.js
 *
 * ------------------------------------------------------------------------------
 */

"use strict";

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function inclusiveRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor((Math.random() * (max - min)) + min);
}

function playRandomTrack() {
    const rootMusicDirectory = "./music";
    const songTrackList = [
	"song01.mp3",
	"song02.mp3",
	"song03.mp3",
	"song04.mp3",
	"song05.mp3",
    ];

    const randomTrackValue = songTrackList[inclusiveRandomInt(0, songTrackList.length)];
    const randomTrack = `${rootMusicDirectory}/${randomTrackValue}`;

    // Now play the song by creating a source element:

    let audioElement = document.getElementById("music-player");
    // Choose another song to play if a song has already played before:
    if (audioElement.firstElementChild) {
	audioElement.firstElementChild.setAttribute("src", randomTrack);
	// PROTIP: Always call this once you change the song!
	// Otherwise, it will continue to play the same song!
	audioElement.load();
    }
    else {
	let sourceElement = document.createElement("source");
	sourceElement.setAttribute("src", randomTrack);
	sourceElement.setAttribute("type", "audio/mpeg");
	audioElement.appendChild(sourceElement);
    }

    // Now play the audio file.
    audioElement.play();
    audioElement.onended = () => { playRandomTrack(); };
}

// Now bind it to the audioElement:
// let audioElement = document.getElementById("music-player");
playRandomTrack();
