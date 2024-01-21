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
    "emptyPuzzlePiecePath": "./images/emptypiece.jpg",

    "puzzleColumnLength": -1,
    "puzzleRowLength": -1,
    
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

let copiedPuzzleContainerCollection = {};
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


function SetPuzzleSize() {

}


//--------------------------------------
// Puzzle History Section
//--------------------------------------

function clearPuzzleHistory() {
    puzzleHistoryList.length = 0;
}

function storeHistoryObject(blankPuzzleElement, puzzleElement) {
    // Possible tuple is as follows:
    // { puzzlePiece1-backgroundx, puzzlePiece
    let historyObject = {
        "blankPieceX": blankPuzzleElement.style.backgroundPositionX,
        "blankPieceY": blankPuzzleElement.style.backgroundPositionY,
        "blankPieceBackgroundSize": blankPuzzleElement.style.backgroundSize,
        "blankPieceBackgroundImage": blankPuzzleElement.style.backgroundImage,

        "blankElementId": blankPuzzleElement.id,
        "puzzleElementId": puzzleElement.id,
        
        "pieceBackgroundX": puzzleElement.style.backgroundPositionX,
        "pieceBackgroundY": puzzleElement.style.backgroundPositionY,
        "pieceBackgroundSize": puzzleElement.style.backgroundSize,
        "pieceBackgroundImage": puzzleElement.style.backgroundImage
    };

    puzzleHistoryList.push(historyObject);
}

//--------------------------------------
// Tile Movement Section
//--------------------------------------

function moveTile(child) {
    const currentElement = child;

    // If there's no id associated with this, bail:
    if (!currentElement || !currentElement.id)
        return false;

    // child.id = `piece_${xValue}_${yValue}`;
    // piece_0_1
    const puzzleRegex = /piece_\d_\d/;

    // fail if the id doesn't follow a piece_x_y pattern:
    if (!puzzleRegex.test(currentElement.id))
        return false;

    // If the title is the blank tile, abort:
    if (isTileBlank(currentElement))
        return false;

    
    // Parse the x and y coordinates from the id by removing the 'piece_' string:
    const coordinateString = String(currentElement.id).substring(6);
    const xValue = Number(coordinateString[0]);
    const yValue = Number(coordinateString[2]);

    // now check if there any blank tiles around:

    const blankElement = findBlankTile(currentElement, xValue, yValue);
    if (blankElement) {
        swapTileElementWithBlankTile(currentElement, blankElement);
    }
}


function swapTileElementWithBlankTile(currentElement, blankElement) {
    // Bail if the blankElement is NOT blank. This shouldn't happen, but it might:
    if (!isTileBlank(blankElement)) {
        console.log(`swapTileElementWithBlankTile(): blankElement ${blankElement} is NOT BLANK! I'm getting out of here!`);
        return;
    }

    // First store the attempt:
    storeHistoryObject(blankElement, currentElement);
    
    const tempBackgroundPositionX = currentElement.style.backgroundPositionX;
    const tempBackgroundPositionY = currentElement.style.backgroundPositionY;
    const tempBackgroundSize = currentElement.style.backgroundSize;
    const tempBackgroundImage = currentElement.style.backgroundImage;

    currentElement.style.backgroundPositionX = blankElement.style.backgroundPositionX;
    currentElement.style.backgroundPositionY = blankElement.style.backgroundPositionY;
    currentElement.style.backgroundSize = blankElement.style.backgroundSize;
    currentElement.style.backgroundImage = blankElement.style.backgroundImage;


    blankElement.style.backgroundPositionX = tempBackgroundPositionX;
    blankElement.style.backgroundPositionY = tempBackgroundPositionY;
    blankElement.style.backgroundSize = tempBackgroundSize;
    blankElement.style.backgroundImage = tempBackgroundImage;

}


function findBlankTile(tileElement, xValue, yValue) {   
    // Leave this undefined:
    let blankTileCoordinateList;
        
    if ((blankTileCoordinateList = canMoveTileUp(xValue, yValue)))
        ;
    else if ((blankTileCoordinateList = canMoveTileDown(xValue, yValue)))
        ;
    else if ((blankTileCoordinateList = canMoveTileLeft(xValue, yValue)))
        ;
    else if ((blankTileCoordinateList = canMoveTileRight(xValue, yValue)))
        ;
    else
        blankTileCoordinateList = [-1, -1];
           
    return document.getElementById(`piece_${blankTileCoordinateList[0]}_${blankTileCoordinateList[1]}`);
}

function canMoveTileUp(xValue, yValue) {
    const checkElementX = xValue;
    const checkElementY = yValue - 1;

    return genericCanMoveCheck(checkElementX, checkElementY);
}

function canMoveTileDown(xValue, yValue) {
    const checkElementX = xValue;
    const checkElementY = yValue + 1;

    return genericCanMoveCheck(checkElementX, checkElementY);
}

function canMoveTileLeft(xValue, yValue) {
    const checkElementX = xValue - 1;
    const checkElementY = yValue;

    return genericCanMoveCheck(checkElementX, checkElementY);
}

function canMoveTileRight(xValue, yValue) {
    const checkElementX = xValue + 1;
    const checkElementY = yValue;
    
    return genericCanMoveCheck(checkElementX, checkElementY);
}


function genericCanMoveCheck(checkElementX, checkElementY) {
    const puzzleRowLength = constantObject.puzzleRowLength;
    if (!(0 <= checkElementX && checkElementX <= puzzleRowLength) || !(0 <= checkElementY && checkElementY <= puzzleRowLength))
        return false;

    // Now retrieve the element id and check:
    let checkElement = document.getElementById(`piece_${checkElementX}_${checkElementY}`);
    
    if (!checkElement)
        return false;

    return isTileBlank(checkElement)? [checkElementX, checkElementY] : false;
}


function isTileBlank(tileElement) {
    return (tileElement.style.backgroundImage === `url("${constantObject.emptyPuzzlePiecePath}")`);
}

//--------------------------------------
// Winning Condition Section
//--------------------------------------

function checkIfGameIsWon() {
    const currentPuzzleContainerList = document.getElementById("main-puzzle-container").children;
    
    if (currentPuzzleContainerList.length !== copiedPuzzleContainerCollection.length)
	return false;
    
    // Now check if each item is the same 
    let index = 0;

    for (let puzzleChild of currentPuzzleContainerList) {
	if (puzzleChild !== copiedPuzzleContainerCollection.item(index++))
	    return false;
    }
    
    // If all's well, sound the bell and end the game:
    window.alert("You have won the game! Reloading the page")
    window.location.reload();

}




function randomizePuzzle() {
    window.alert("randomizePuzzle()");
}




function generatePuzzleImage() {
    let randomImageIndex = inclusiveRandomInt(0, constantObject.puzzleImageList.length);
    let randomImagePath = `${constantObject.rootImagePath}/${constantObject.puzzleImageList[randomImageIndex]}`;
    let puzzleContainerElement = document.getElementById("main-puzzle-container");

    // Now for each element in main-puzzle-container, set the background image to be the random image.
    const puzzleRowLength = Math.sqrt(constantObject.maxPuzzlePieces);
    const puzzleColumnLength = puzzleRowLength;

    // Now assign them to the constantObject:
    constantObject.puzzleColumnLength = puzzleColumnLength;
    constantObject.puzzleRowLength = puzzleRowLength;
    
    // Generate a random pair to place the blank tile in:
    const randomBlackTileX = inclusiveRandomInt(0, puzzleColumnLength);
    const randomBlackTileY = inclusiveRandomInt(0, puzzleRowLength);

    let xValue = 0;
    let yValue = 0;
    for (let child of puzzleContainerElement.children) {
        if (xValue === randomBlackTileX && yValue === randomBlackTileY) {
            child.style.backgroundImage = `url('${constantObject.emptyPuzzlePiecePath}')`;
            child.style.backgroundSize = 'cover';
        }
        else {
        
            child.style.backgroundImage = `url('${randomImagePath}')`;
        
            // We have to multiply by -1 to do the offset correctly:
            let backgroundPositionX = -1 * xValue * constantObject.puzzlePieceWidth;
            let backgroundPositionY = -1 * yValue * constantObject.puzzlePieceHeight;

            child.style.backgroundPositionX = `${backgroundPositionX}px`
            child.style.backgroundPositionY = `${backgroundPositionY}px`;
            child.style.backgroundSize = `${constantObject.puzzlePieceWidth * puzzleColumnLength}px`;
        }

        child.id = `piece_${xValue}_${yValue}`;
        child.onclick = function() { moveTile(child); }
        
        xValue += 1;
        
        if (xValue % puzzleColumnLength === 0) {
            xValue = 0; ++yValue;
        }
    }

    // Now make a copy of the collection to check if the game will be won:
    copiedPuzzleContainerCollection = structuredClone(puzzleContainerElement.children);
    
}


function startGame() {
    // window.alert("Start the Game!");
    // Before anything, clear the hstory list:
    clearPuzzleHistory();
    generatePuzzleImage();
    

}
