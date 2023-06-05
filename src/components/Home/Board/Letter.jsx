import React, { useContext } from "react";
import "./boardStyles.css";
import { AppContext } from "../../Context/AppContext";

export default function Letter(props) {

    const [board, setBoard, currentTry, setCurrentTry, wordState, setWordState, onBackspace, onEnter, counter, setCounter] = useContext(AppContext);
    const index = props.index;
    const rowIndex = props.rowIndex;

    const rightLetter = wordState.correctWord[index];
    const currentLetter = board[rowIndex][index].toString().toLowerCase();
    
    const isCorrect = rightLetter === currentLetter;
    const isPresent = !isCorrect && currentLetter !== "" && wordState.correctWord.includes(currentLetter)

    const letterClass = (currentTry.currentRow === 7 && rowIndex === 5) ? (isCorrect ? "correctPos" : isPresent ? "otherPos" : "notPresent") : currentTry.currentRow > rowIndex ? (isCorrect ? "correctPos" : isPresent ? "otherPos" : "notPresent") : "letter";

    return (<div className={letterClass} key={index} id={index.toString()}>
        {board[rowIndex][index]}
    </div>)

}