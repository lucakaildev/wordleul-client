import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Nav() {

    const [board, setBoard, currentTry, setCurrentTry, wordState, setWordState, onBackspace, onEnter, onLetterPress, onEscape, firstRowArray, secondRowArray, thirdRowArray, language, changeLocation, changeLanguage, statsModal, changeStatsModal] = useContext(AppContext);

    const daily = language === "english" ? "DAILY" : "DIARIO"
    const uL = language === "english" ? "UNLIMITED" : language === "portuguese" ? "SEM LIMITES" : "SIN LIMITES"
    const statistics = language === "english" ? "STATISTICS" : language === "portuguese" ? "ESTATISTICAS" : "ESTADISTICAS"

    return (
        <>
            <div>
                <NavLink to="/" id="/" className="nav-link" onClick={(e) => changeLocation(e)}>{daily}</NavLink>
            </div>
            <div>
                <NavLink to="/unlimited" id="/unlimited" className="nav-link" onClick={(e) => changeLocation(e)}>{uL}</NavLink>
            </div>
            <div>
                <a className="nav-link" onClick={(e)=> changeStatsModal(e)}>{statistics}</a>
            </div>
            <div className="auth-container">
                <button id={language === "english" ? "portuguese" : "english"} className="login-button" onClick={(e) => changeLanguage(e)}>{language === "english" ? "PORTUGUESE" : "ENGLISH"}</button>
                <button className="register-button" id={language === "spanish" ? "portuguese" : "spanish"} onClick={(e) => changeLanguage(e)}>{language === "spanish" ? "PORTUGUESE" : "SPANISH"}</button>
            </div>
        </>
    )
}