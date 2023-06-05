import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import "./boardStyles.css";
import Letter from "./Letter";

export default function Board() {

    const [board, setBoard, currentTry, setCurrentTry, wordState, setWordState, onBackspace, onEnter, onLetterPress, onEscape, firstRowArray, secondRowArray, thirdRowArray, language, changeLocation, changeLanguage, statsModal, changeStatsModal, refreshBoard, showPopUp, setPopUp] = useContext(AppContext);

    const version = language === "english" ? "engVersion" : "language" === "portuguese" ? "brVersion" : "spanishVersion"

    const solvedMessage = language === "english" ? "Congrats! Wordle solved" : language === "portuguese" ? "Parabéns! Wordle resolvido" : "Felicitaciones! Wordle resuelto"

    const failedMessage = language === "english" ? `Oops! Word was "${wordState.correctWord}"` : language === "portuguese" ? `Oops! A palavra era "${wordState.correctWord}"` : `Oops! La palabra era "${wordState.correctWord}"`

    const notInDictionary = language === "english" ? "Word is not in dictionary" : language === "portuguese" ? "A palavra não está no dicionário" : "La palabra no está en el diccionario"

    const storedState = JSON.parse(localStorage.getItem([version]))
    const streak = storedState && (window.location.pathname === "/" ? storedState.streakDL : storedState.streakUL)

    const rows = board.map((val, i, e) =>
    (<div className="row" key={i}>
        {board[i].map((val, j, e) => {
            return (<Letter index={j} rowIndex={i} key={j}></Letter>)
        })}
    </div>))

    useEffect(()=> {
        if (showPopUp.popup) {
            setTimeout(() => {
                setPopUp({popup: false})
            }, 3000)
        }
    }, [showPopUp])

    return (
        <div>
            <div className="board">
                {currentTry.gameOver === true &&
                    <div className="success-popup">
                        {streak === true ? solvedMessage : failedMessage}
                    </div>
                }
                {   showPopUp.popup === true &&
                    <div className="dictionary-popup">
                        {notInDictionary}
                    </div>
                }
                {rows}
            </div>
        </div>
    )
}