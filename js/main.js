/*
 * -----------------------------------------------------------------------------
 * Created by Ulysses Carlos on 01/18/2024 at 10:25 PM
 *
 * main.js
 *
 * -----------------------------------------------------------------------------
 */


"use strict";


//------------------------------------------------------------------------------
// Global Variables:
//------------------------------------------------------------------------------
const constantObject = {
    "rootImagePath": "./images",
    "puzzleImageList": [
        "image01.jpg",
        "image02.jpg",
        "image03.jpg",
        "image04.jpg",
        "image05.jpg",
        "image06.jpg",
	"image07.jpg",
	"image08.jpg",
	"image09.jpg",
	"image10.jpg",
	"image11.jpg",
	"image12.jpg"
    ],
    "blankImagePath": "./images/blank.jpg",
    "currentImage" : "./images/blank.jpg",
    
    "puzzleImageWidth": 1000,
    "puzzleImageHeight": 1000,
    
    "puzzlePieceWidth": 150,
    "puzzlePieceHeight": 150,


    
    // Corresponds to a 4 x 4 Puzzle; 3x3 and 5x5 Puzzles are also possible.
    "maxPuzzlePieces": 16,
    "difficultyLevel": {
        "babby" : 5,
        "easy": 15,
        "normal": 35,
        "hard": 65,
        "insane": 150,
        "god": 300      
    }
    
    
};


let puzzleHistoryList = [];



//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function inclusiveRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor((Math.random() * (max - min)) + min);
}


//------------------------------------------------------------------------------
// Sliding Puzzle Section
//------------------------------------------------------------------------------

function changeDifficulty() {
    window.alert("Change Difficulty!");
}

//--------------------------------------
// Puzzle Solver Section
//--------------------------------------

function solveGame() {
    window.alert("Solve the Puzzle for Me!");
}




//--------------------------------------
// Tile Movement 
//--------------------------------------




function moveTile(sourceTile, destinationTile) {

}

function canMoveTileUp(tile) {

}

function canMoveTileDown(tile) {

}

function canMoveTileLeft(tile) {

}

function canMoveTileRight(tile) {

}




//--------------------------------------
//
//--------------------------------------


function randomizePuzzle() {
    document.getElement
}

function applyPuzzleImage() {
    let randomImageIndex = inclusiveRandomInt(0, constantObject.puzzleImageList.length);
    let randomImagePath = `${constantObject.rootImagePath}/${constantObject.puzzleImageList[randomImageIndex]}`;
    let puzzleContainerElement = document.getElementById("main-puzzle-container");

    // Now for each element in main-puzzle-container, set the background image to be the random image.

    const puzzleRowLength = Math.sqrt(constantObject.maxPuzzlePieces);
    const puzzleColumnLength = puzzleRowLength;

    const backgroundPositionHeight = constantObject.puzzleImageHeight / puzzleRowLength;
    const backgroundPositionWidth = constantObject.puzzleImageWidth / puzzleColumnLength;

    let xValue = 0;
    let yValue = 0;
    for (let child of puzzleContainerElement.children) {
        child.style.backgroundImage = `url('${randomImagePath}')`;
        let backgroundPositionX = -1 * xValue * constantObject.puzzlePieceWidth;
        let backgroundPositionY = -1 * yValue * constantObject.puzzlePieceHeight;

        child.style.backgroundPositionX = `${backgroundPositionX}px`
        child.style.backgroundPositionY = `${backgroundPositionY}px`;
	child.style.backgroundSize = `${constantObject.puzzlePieceWidth * puzzleColumnLength}px`;
        
        xValue += 1;
        
        if (xValue % puzzleColumnLength === 0) {
            xValue = 0;
            ++yValue;
        }
    }
    
}


function startGame() {
    // window.alert("Start the Game!");
    applyPuzzleImage();
    

}
