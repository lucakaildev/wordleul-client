import React, { useContext, useEffect } from "react";
import Board from "./Board/Board";
import Keyboard from "./Keyboard/Keyboard";
import "./homescreenStyles.css"
import { AppContext } from "../Context/AppContext";
import Nav from "./Nav/Nav";
import Stats from "./Stats/Stats";
export default function Home() {

    const [board, setBoard, currentTry, setCurrentTry, wordState, setWordState, onBackspace, onEnter, onLetterPress, onEscape, firstRowArray, secondRowArray, thirdRowArray, language, changeLocation, changeLanguage, statsModal, changeStatsModal] = useContext(AppContext);

    let isPressed = false;

    const handleKeyboard = (e) => {

        if (isPressed || e.repeat) return;

        if (e.key === "Backspace") {
            isPressed = true;
            onBackspace(e);
        }
        if (e.key === "Enter") {
            isPressed = true;
            onEnter(e);
        }
        if (e.key === "Escape") {
            isPressed = true;
            onEscape(e);
        }
        else {
            if (e.key !== "Enter" && e.key !== "Backspace") {
                isPressed = true;
                let letter = e.key.toUpperCase();
                if (firstRowArray.includes(letter) || secondRowArray.includes(letter) || thirdRowArray.includes(letter)) {
                    onLetterPress(e);
                }
            }
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", () => {
            isPressed = false;
        })
        return () => {
            document.removeEventListener("keyup", () => { isPressed = false })
            document.removeEventListener("keydown", handleKeyboard);
        }
    }, [handleKeyboard])


    return (
        <div className="homescreen">
            <header>
                <div className="logo-container">
                    <h1><span className="text-decoration1">WORDLE</span><br></br> <span className="text-decoration2">UNLIMITED.</span></h1>
                </div>
                <Nav></Nav>
            </header>
            <Board />
            <Keyboard />
            {
            statsModal === true &&
                <Stats></Stats>
            }
        </div>
    )
}