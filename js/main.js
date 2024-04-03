/*
 * -----------------------------------------------------------------------------
 * Created by Ulysses Carlos on 01/18/2024 at 10:25 PM
 *
 * main.js
 * Main JavaScript file for the Sliding Puzzle game.
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
        "image12.jpg",
        "image13.jpg",
        "image14.jpg",
        "image15.jpg",
        "image16.jpg"
    ],
    "blankImagePath": "./images/blank.jpg",
    "emptyPuzzlePiecePath": "./images/emptypiece.jpg",

    "puzzleColumnLength": -1,
    "puzzleRowLength": -1,
    
    "puzzleImageWidth": 1000,
    "puzzleImageHeight": 1000,
    
    "puzzlePieceWidth": 150,
    "puzzlePieceHeight": 150,

    "startTime": -1,
    "endTime": -1,
    
    // Corresponds to a 4 x 4 Puzzle; 3x3 and 5x5 Puzzles are also possible.
    "minPuzzlePieces": 9,
    "currentPuzzlePieces": 16,
    "maxPuzzlePieces": 25,
    "difficultyLevel": {
        "babby" : 5,
        "easy": 15,
        "normal": 35,
        "hard": 65,
        "insane": 150,
        "god": 300
    },
    
    "blankCoordinates": [-1, -1]
};

let copiedPuzzleContainer = [];
let puzzleHistoryList = [];
let currentDifficulty = constantObject.difficultyLevel["insane"];



//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function inclusiveRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor((Math.random() * (max - min)) + min);
}


function clearCopiedPuzzleContainer() {
    copiedPuzzleContainer.length = 0;
}

function clearPuzzleHistory() {
    puzzleHistoryList.length = 0;
}

function resetPuzzleStopwatch() {
    constantObject.startTime = new Date();
    constantObject.endTime = null;
}


function isTileCoordinateInPuzzle(xValue, yValue) {
    return ((0 <= xValue && xValue < constantObject.puzzleColumnLength) && (0 <= yValue && yValue < constantObject.puzzleRowLength));

}

function generateDynamicGridTemplate(PuzzlePieceRowLength) {
    let gridTemplateString = "";
    for (let i = 0; i < PuzzlePieceRowLength; i++)
        gridTemplateString += `${constantObject.puzzlePieceWidth}px `;
    
    return gridTemplateString;
}

function clearPuzzleContainer() {
    let mainPuzzleContainerElement = document.getElementById("main-puzzle-container");

    for (let puzzlePiece of mainPuzzleContainerElement.children) {
        puzzlePiece.id = "";
        puzzlePiece.style.backgroundImage = `url("${constantObject.blankImagePath}")`;
        puzzlePiece.style.backgroundPositionX = "";
        puzzlePiece.style.backgroundPositionY = "";
        puzzlePiece.style.backgroundSize = "";
        puzzlePiece.onclick = "";        
    }

    if (constantObject.startTime !== -1)
        constantObject.startTime = -1;
    
}


function removePuzzleElementsFromContainer(elementNumber) {
    if (elementNumber === 0)
        return;

    // First things first: clear any ids from the existing elements:
    clearPuzzleContainer();
   
    let mainPuzzleContainerElement = document.getElementById("main-puzzle-container");

    if (elementNumber >= constantObject.currentPuzzlePieces)
        mainPuzzleContainerElement.replaceChildren();
    else {
        // Remove from the end of the list:
        let childrenLength = mainPuzzleContainerElement.children.length;
        for (let index = 0; index < elementNumber; index++) {
            mainPuzzleContainerElement.children.item(childrenLength - 1 - index).remove();
        }       
    }    
}


function appendPuzzleElementsToContainer(elementNumber) {    
    if (elementNumber === 0)
        return;

    // Prevent adding a shitload of puzzle pieces
    if ((elementNumber + constantObject.currentPuzzlePieces) > constantObject.maxPuzzlePieces)
        return;
    
    // First things first: clear any ids from the existing elements:
    clearPuzzleContainer();
    
    let mainPuzzleContainerElement = document.getElementById("main-puzzle-container");

    for (let index = 0; index < elementNumber; index++) {
        let divContainer = document.createElement("div");
        divContainer.setAttribute("class", "main-puzzle-container puzzle-piece");
        divContainer.style.backgroundImage = `url("${constantObject.blankImagePath}")`;
        mainPuzzleContainerElement.append(divContainer);
    }    
}


async function disablePuzzleSizeRadioButtons() {
    let radioButtonList = document.getElementsByName("puzzle-size");
    for (let radioButton of radioButtonList)
        radioButton.disabled = true;    
}

async function enablePuzzleSizeRadioButtons() {
    let radioButtonList = document.getElementsByName("puzzle-size");
    for (let radioButton of radioButtonList)
        radioButton.disabled = false;
}

//------------------------------------------------------------------------------
// Sliding Puzzle Section
//------------------------------------------------------------------------------


function changeDifficulty() {
    let difficultyLevel = window.prompt("Please select a difficulty level (babby, easy, normal, hard, insane, god)").toLocaleLowerCase();
    if (Object.hasOwn(constantObject.difficultyLevel, difficultyLevel))
        currentDifficulty = constantObject.difficultyLevel[difficultyLevel];
    else
        window.alert("That difficulty level is NOT in the list. Defaulting to Normal difficulty.");
}

//--------------------------------------
// Puzzle Solver Section
//--------------------------------------

async function solveGame() {
    const milisecondSleep = 500;
    // Next, simply go through the history element and swap back the items
    if (puzzleHistoryList.length === 0) {
        window.alert("No puzzle has been initialized yet!");
        return;
    }

    // remove the onclick event for each element:
    let mainPuzzleContainerElement = document.getElementById("main-puzzle-container");
    for (let element of mainPuzzleContainerElement.children) {
        element.onclick = "";
    }
    
    for (let index = puzzleHistoryList.length - 1; index >= 0; index--) {
        // Grab the previous index
        let originalblankElementId = puzzleHistoryList[index].blankElementId;
        let currentBlankElementId = puzzleHistoryList[index].puzzleElementId;

        // Now create the two elements

        // The 
        let originalBlankElement = document.getElementById(originalblankElementId);
        
        // The puzzleElement is actually the original place where the blank element was:
        let currentBlankElement = document.getElementById(currentBlankElementId);

        swapTileElementWithBlankTile(originalBlankElement, currentBlankElement);
        // Method to sleep:
        await new Promise(r => setTimeout(r, milisecondSleep)); 
    }
    
    window.alert("I solved the game for you, so why won't you try again?");
    window.location.reload();
}


//--------------------------------------
// Dynamic Puzzle Size Section
//--------------------------------------


function setPuzzleSize(puzzlePieceRowLength) {
    // First, set the current number of puzzles:
    const numberOfPieces = puzzlePieceRowLength * puzzlePieceRowLength;

    // If the size is already the same as the passed argument or if it's out of bounds, abort.
    if (numberOfPieces === constantObject.currentPuzzlePieces)
        return;
    
    if ((!(constantObject.minPuzzlePieces <= numberOfPieces && numberOfPieces <= constantObject.maxPuzzlePieces)))
        return;

    // Now, modify the size of the puzzle table, and then draw it anew.
    const rowLengthInPixels = constantObject.puzzlePieceWidth * puzzlePieceRowLength;
    // Now modify the width and height of the main puzzle container:
    let mainPuzzleContainerElement = document.getElementById("main-puzzle-container");
    
    // Increase the width:
    mainPuzzleContainerElement.style.width = `${rowLengthInPixels}px`;
    mainPuzzleContainerElement.style.height = `${rowLengthInPixels}px`;
    
    mainPuzzleContainerElement.style.gridTemplateColumns = generateDynamicGridTemplate(puzzlePieceRowLength);    
    mainPuzzleContainerElement.style.gridTemplateRows = generateDynamicGridTemplate(puzzlePieceRowLength);


    // If the new number of elements is greater than the current, than append new elements to the container:
    if (numberOfPieces > constantObject.currentPuzzlePieces)
        appendPuzzleElementsToContainer((numberOfPieces - constantObject.currentPuzzlePieces));
    else
        removePuzzleElementsFromContainer((constantObject.currentPuzzlePieces - numberOfPieces));

    // Finally, change the current puzzle piece size and check the appropriate radio button:
    constantObject.currentPuzzlePieces = numberOfPieces;

    let currentRadioButtonElement = document.getElementById(`puzzle_piece_${puzzlePieceRowLength}_${puzzlePieceRowLength}`);
    if (currentRadioButtonElement)
        currentRadioButtonElement.checked = true;

}

//--------------------------------------
// Puzzle History Section
//--------------------------------------

function storeHistoryObject(blankPuzzleElement, puzzleElement) {
    // Possible tuple is as follows:
    let historyObject = {
        // "blankPieceX": blankPuzzleElement.style.backgroundPositionX,
        // "blankPieceY": blankPuzzleElement.style.backgroundPositionY,
        // "blankPieceBackgroundSize": blankPuzzleElement.style.backgroundSize,
        // "blankPieceBackgroundImage": blankPuzzleElement.style.backgroundImage,

        "blankElementId": blankPuzzleElement.id,
        "puzzleElementId": puzzleElement.id,
        
        // "pieceBackgroundX": puzzleElement.style.backgroundPositionX,
        // "pieceBackgroundY": puzzleElement.style.backgroundPositionY,
        // "pieceBackgroundSize": puzzleElement.style.backgroundSize,
        // "pieceBackgroundImage": puzzleElement.style.backgroundImage
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

    const blankElement = findBlankTile(xValue, yValue);
    if (blankElement) {
        swapTileElementWithBlankTile(currentElement, blankElement);
        
        if (checkIfGameIsWon()) {
            // If all's well, sound the bell and end the game:
            constantObject.endTime = new Date();
            const puzzleTimeElpased = (constantObject.endTime.getTime() - constantObject.startTime.getTime()) / 1000;
            const puzzleTimeMessage = (puzzleTimeElpased === 1)? `You have won the game in a single second... Cheater.`
                  : `You won the game in ${puzzleTimeElpased} seconds! I'll now reload the page for a new puzzle!`;
            
            window.alert(puzzleTimeMessage);
            window.location.reload();
        }
    }
}


function swapTileElementWithBlankTile(currentElement, blankElement, checkForBlankElements = true) {
    // Bail if the blankElement is NOT blank. This shouldn't happen, but it might:
    if (!isTileBlank(blankElement) && checkForBlankElements) {
        console.log(`swapTileElementWithBlankTile(): I tried to swap ${currentElement.id} with `
                    + `blankElement ${blankElement.id} but it's NOT BLANK! I'm getting out of here!`);
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


function findBlankTile(xValue, yValue) {
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
    
    if (currentPuzzleContainerList.length !== copiedPuzzleContainer.length)
        return false;
    
    // Now check if each item is the same 
    let index = 0;

    for (let puzzleChild of currentPuzzleContainerList) {
        if (!arePuzzlePiecesEqual(puzzleChild, copiedPuzzleContainer[index++]))
            return false;
    }
    
    return true;

}

function arePuzzlePiecesEqual(puzzlePieceElement, copiedPuzzlePiece) {
    if (puzzlePieceElement.style.backgroundImage !== copiedPuzzlePiece.backgroundImage)
        return false;
    else if (puzzlePieceElement.style.backgroundPositionX !== copiedPuzzlePiece.backgroundPositionX)
        return false;
    else if (puzzlePieceElement.style.backgroundPositionY !== copiedPuzzlePiece.backgroundPositionY)
        return false;
    else if (puzzlePieceElement.style.backgroundSize !== copiedPuzzlePiece.backgroundSize)
        return false;
    
    return true;

}



//--------------------------------------
// Puzzle Generation Section
//--------------------------------------

function generatePuzzleImage() {
    // First things first: Clear the puzzle history, the puzzle container used to check for the correct puzzle
    // and reset the stopwatch:
    clearPuzzleHistory();
    clearCopiedPuzzleContainer();
    
    let randomImageIndex = inclusiveRandomInt(0, constantObject.puzzleImageList.length);
    let randomImagePath = `${constantObject.rootImagePath}/${constantObject.puzzleImageList[randomImageIndex]}`;
    let puzzleContainerElement = document.getElementById("main-puzzle-container");

    // Now for each element in main-puzzle-container, set the background image to be the random image.
    const puzzleRowLength = Math.sqrt(constantObject.currentPuzzlePieces);
    const puzzleColumnLength = puzzleRowLength;

    // Now assign them to the constantObject:
    constantObject.puzzleColumnLength = puzzleColumnLength;
    constantObject.puzzleRowLength = puzzleRowLength;
    
    // Generate a random pair to place the blank tile in:
    const randomBlankTileX = inclusiveRandomInt(0, puzzleColumnLength);
    const randomBlankTileY = inclusiveRandomInt(0, puzzleRowLength);

    let xValue = 0;
    let yValue = 0;
    for (let child of puzzleContainerElement.children) {
        if (xValue === randomBlankTileX && yValue === randomBlankTileY) {
            child.style.backgroundImage = `url('${constantObject.emptyPuzzlePiecePath}')`;
            child.style.backgroundSize = 'cover';
            constantObject.blankCoordinates[0] = randomBlankTileX;
            constantObject.blankCoordinates[1] = randomBlankTileY;
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

        // Create a copy of the background image, position:
        let copiedChildOject = {
            backgroundImage: child.style.backgroundImage,
            backgroundPositionX: child.style.backgroundPositionX,
            backgroundPositionY: child.style.backgroundPositionY,
            backgroundSize: child.style.backgroundSize
        };
        
        copiedPuzzleContainer.push(copiedChildOject);
    }
}


//--------------------------------------
// Puzzle Shuffling Section
//--------------------------------------

function generateRandomDirectionCoordinates(randomDirection, xValue, yValue) {
    switch(randomDirection) {
    case 1: // Up
        return [xValue, yValue - 1];
    case 2: // Down
        return [xValue, yValue + 1];
    case 3: // Left
        return [xValue - 1, yValue];
    case 4: // Right
        return [xValue + 1, yValue];
    }
}

function isRandomMoveValid(randomCoordinates) {
    if (!isTileCoordinateInPuzzle(randomCoordinates[0], randomCoordinates[1]))
        return false;

    // Next, check if the previous move is an inverse of the current move
    // (i.e, are we moving up when we moved down the previous move?
    // If so, return false so that we can move in a different direction.
    return true;
}

function randomMove(tempBlankCoordinates) {
    const maxCoodinateRandomCount = 10;
    const numberOfDirections = 4;
    
    let xValue = tempBlankCoordinates[0];
    let yValue = tempBlankCoordinates[1];
    for (let randomCount = 0; randomCount < maxCoodinateRandomCount; randomCount++) {
        let randomDirection = inclusiveRandomInt(1, numberOfDirections);
        const randomCoordinates = generateRandomDirectionCoordinates(randomDirection, xValue, yValue);

        // If the coordinates fall in the given range, swap automatically. Otherwise, redo.
        if (!isRandomMoveValid(randomCoordinates))
            continue;
        else
            return randomCoordinates;
    }

    // If that fails, return the default:
    return tempBlankCoordinates;
    

}

function shufflePuzzleImage() {    
    let tempBlankCoordinates = constantObject.blankCoordinates;
    let tempBlankElement = document.getElementById(`piece_${tempBlankCoordinates[0]}_${tempBlankCoordinates[1]}`);
    
    for (let moveIndex = 0; moveIndex < currentDifficulty; moveIndex++) {       
        let newBlankCoordinates = randomMove(tempBlankCoordinates);
        let newTileElement = document.getElementById(`piece_${newBlankCoordinates[0]}_${newBlankCoordinates[1]}`);
        if (newTileElement) {
            swapTileElementWithBlankTile(newTileElement,tempBlankElement);
            tempBlankCoordinates = newBlankCoordinates;
            tempBlankElement = document.getElementById(`piece_${tempBlankCoordinates[0]}_${tempBlankCoordinates[1]}`);
        }
    }    
}


//------------------------------------------------------------------------------
// Main Function:
//------------------------------------------------------------------------------

function startGame() {
    disablePuzzleSizeRadioButtons();
    generatePuzzleImage();
    setTimeout(enablePuzzleSizeRadioButtons, 3000);
    setTimeout(shufflePuzzleImage, 3000);
    resetPuzzleStopwatch();    
    
}
