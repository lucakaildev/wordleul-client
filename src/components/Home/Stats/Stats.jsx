import React, { useContext, useEffect, useState } from "react"
import { AppContext } from "../../Context/AppContext";
import "./statsStyles.css"
import TwitterLogo from "./twitterlogo.png"
import FacebookIcon from "./fbicon.png"
import TelegramIcon from "./tgicon.png"
import WhatsappIcon from "./wplogo.png"

export default function Stats() {

    const [board, setBoard, currentTry, setCurrentTry, wordState, setWordState, onBackspace, onEnter, onLetterPress, onEscape, firstRowArray, secondRowArray, thirdRowArray, language, changeLocation, changeLanguage, statsModal, changeStatsModal, refreshBoard] = useContext(AppContext);

    const [active, setActive] = useState(true);
    const [mode, setMode] = useState(window.location.pathname === "/" ? "daily" : "unlimited");

    const [remaining, setRemaining] = useState("00:00:00");

    const today = new Date().setHours(0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1)

    const getRemaining = (endtime) => {
        const total = Date.parse(endtime) - Date.parse(new Date());

        const seconds = Math.floor((total / 1000) % 60)
        const minutes = Math.floor((total / 1000 / 60) % 60)
        const hours = Math.floor((total / 1000 / 60 / 60) % 24)
        return { total, seconds, minutes, hours }

    }

    const version = language === "english" ? "engVersion" : language === "portuguese" ? "brVersion" : "spanishVersion"

    const storedStats = localStorage.getItem([version]) && JSON.parse(localStorage.getItem([version]))

    const { playedDL, wonDL, currentStreakDL, maxStreakDL, playedUL, wonUL, currentStreakUL, maxStreakUL, graphDataDL, graphDataUL } = storedStats;

    const lostDL = playedDL - wonDL;
    const lostUL = playedUL - wonUL;

    const calculateWinRate = (graphItem, won, lost) => {
        return (graphItem / (won + lost)) * 100
    }


    const progressDL = [calculateWinRate(graphDataDL[0], wonDL, lostDL), calculateWinRate(graphDataDL[1], wonDL, lostDL), calculateWinRate(graphDataDL[2], wonDL, lostDL), calculateWinRate(graphDataDL[3], wonDL, lostDL), calculateWinRate(graphDataDL[4], wonDL, lostDL), calculateWinRate(graphDataDL[5], wonDL, lostDL), calculateWinRate(lostDL, wonDL, lostDL)]

    const progressUL = [calculateWinRate(graphDataUL[0], wonUL, lostUL), calculateWinRate(graphDataUL[1], wonUL, lostUL), calculateWinRate(graphDataUL[2], wonUL, lostUL), calculateWinRate(graphDataUL[3], wonUL, lostUL), calculateWinRate(graphDataUL[4], wonUL, lostUL), calculateWinRate(graphDataUL[5], wonUL, lostUL), calculateWinRate(lostUL, wonUL, lostUL)]

    useEffect(() => {
        active && document.body.classList.add("active-modal")
        !active && document.body.classList.remove("active-modal");
    }, [active])

    useEffect(() => {
        const intervalId = setInterval(() => {
            const { seconds, minutes, hours } = getRemaining(tomorrow)
            setRemaining(`${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}`)
        }, 1000)
        return () => clearInterval(intervalId);
    })

    const shareOnFb = (e) => {

        if (currentTry.gameOver) {

            e.preventDefault();

            const lang = language === "english" ? "EN" : language === "portuguese" ? "BR" : "ES"
            const wordle = `#${wordState.wordleNumber}`

            const msg = `Wordle (${lang}) #${wordle}\n\n${emojiTiles[0].join("")}\n${emojiTiles[1].join("")}\n${emojiTiles[2].join("")}\n${emojiTiles[3].join("")}\n${emojiTiles[4].join("")}\n${emojiTiles[5].join("")}\n\nVisit https://mysite.com to play!`

            window.open('http://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(msg))
        }
    }

    const shareOnTwitter = (e) => {

        if (currentTry.gameOver) {

            const lang = language === "english" ? "EN" : language === "portuguese" ? "BR" : "ES"
            const wordle = wordState.wordleNumber


            const msg = `Wordle (${lang}) #${wordle}\n\n${emojiTiles[0].join("")}\n${emojiTiles[1].join("")}\n${emojiTiles[2].join("")}\n${emojiTiles[3].join("")}\n${emojiTiles[4].join("")}\n${emojiTiles[5].join("")}\n\n Visit https://mysite.com to play!`

            e.preventDefault();
            const navUrl =
                'https://twitter.com/intent/tweet?text=' + encodeURIComponent(msg);
            window.open(navUrl);

        }

    }

    const shareOnWpp = (e) => {

        if (currentTry.gameOver) {

            const lang = language === "english" ? "EN" : language === "portuguese" ? "BR" : "ES"
            const wordle = wordState.wordleNumber


            const msg = `Wordle (${lang}) #${wordle}\n\n${emojiTiles[0].join("")}\n${emojiTiles[1].join("")}\n${emojiTiles[2].join("")}\n${emojiTiles[3].join("")}\n${emojiTiles[4].join("")}\n${emojiTiles[5].join("")}\n\n Visit https://mysite.com to play!`

            e.preventDefault();
            window.open('whatsapp://send?text=' + encodeURIComponent(msg));
        }
    }

    const shareOnTelegram = (e) => {

        if (currentTry.gameOver) {
            const lang = language === "english" ? "EN" : language === "portuguese" ? "BR" : "ES"
            const wordle = wordState.wordleNumber


            const msg = `Wordle (${lang}) #${wordle}\n\n${emojiTiles[0].join("")}\n${emojiTiles[1].join("")}\n${emojiTiles[2].join("")}\n${emojiTiles[3].join("")}\n${emojiTiles[4].join("")}\n${emojiTiles[5].join("")}\n\n Visit https://mysite.com to play!`

            e.preventDefault();

            window.open(`https://t.me/share/url?url=${encodeURIComponent(msg)}`);
        }
    }

    const emojiTiles = [
        ["", "", "", "", "",],
        ["", "", "", "", "",],
        ["", "", "", "", "",],
        ["", "", "", "", "",],
        ["", "", "", "", "",],
        ["", "", "", "", "",]
    ];

    const getTiles = () => {
        if (currentTry.gameOver) {
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 5; j++) {

                    if (board[i][j][0].toLowerCase() === wordState.correctWord[j]) {
                        emojiTiles[i][j] = "🟩"
                    }

                    if ((board[i][j][0].toLowerCase() !== wordState.correctWord[j]) && (board[i][j][0] !== "") && (wordState.correctWord.includes(board[i][j][0].toLowerCase()))) {
                        emojiTiles[i][j] = "🟨"
                    }

                    if ((board[i][j][0] === "") || (!board[i][j][0]) || (!wordState.correctWord.includes(board[i][j][0].toLowerCase()))) {
                        emojiTiles[i][j] = "⬛"
                    }

                     console.log(board[i][j].toLowerCase() === wordState.correctWord[j], wordState.correctWord.includes(board[i][j].toLowerCase()))
                }
            }
        }
    }

    getTiles();

    return (
        <div className="modal-bg">
            {
                mode === "daily" &&
                <div className="modal-content">
                    <div className="top-content">
                        <div className="title">
                            {
                                (language === "english") && <h2>DAILY STATISTICS</h2>
                            }
                            {
                                (language === "spanish") && <h2>ESTADISTICAS DIARIAS</h2>
                            }
                            {
                                (language === "portuguese") && <h2>ESTATISTICAS DIARIAS</h2>
                            }
                        </div>
                        <div className="close-button-container">
                            <button className="close-button" onClick={(e) => { changeStatsModal(e) }}>X</button>
                        </div>
                    </div>
                    <div className="wordle-clock">
                        <p> {language === "english" ? "NEXT" : "Próximo"}
                            <br></br>
                        </p>
                        <div className="remaining">{remaining}</div>
                    </div>
                    <div className="stats-container">
                        <div className="stats-item-container">
                            <p className="stats-item">{playedDL ? playedDL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Played" : language === "portuguese" ? "Jogados" : "Jugados"}</p>
                        </div>
                        <div className="stats-item-container">
                            <p className="stats-item">{wonDL ? wonDL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Won" : language === "portuguese" ? "Vencidos" : "Ganados"}</p>
                        </div>
                        <div className="stats-item-container">
                            <p className="stats-item">{currentStreakDL ? currentStreakDL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Current streak" : language === "portuguese" ? "Série \n de vitórias" : "Racha \n de victorias"}</p>
                        </div>
                        <div className="stats-item-container">
                            <p className="stats-item">{maxStreakDL ? maxStreakDL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Max streak" : language === "portuguese" ? "Record\n de vitórias" : "Record\n de victorias"}</p>
                        </div>
                    </div>
                    <div className="stats-graph">
                        <div className="graph-item-container">
                            <div className="graph-item">1</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressDL[0] + '%' }}></div></div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">2</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressDL[1] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">3</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressDL[2] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">4</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressDL[3] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">5</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressDL[4] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">6</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressDL[5] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">X</div>
                            <div className="progress-container">
                                <div className="lost" style={{ width: progressDL[6] + '%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="over-container">
                        <div>
                            <button className="play-again-button" id="/unlimited" onClick={(e) => refreshBoard(e)}>{language === "english" ? "PLAY UNLIMITED" : language === "portuguese" ? "JOGAR DE NOVO" : "JUGAR DE NUEVO"}</button>
                        </div>
                        <div className="share-container">
                            <button alt="share on twitter" className="share-button" onClick={(e) => { shareOnTwitter(e) }}><img src={TwitterLogo} className="tw-logo"></img></button>
                            <button alt="share on facebook" className="share-button" onClick={(e) => { shareOnFb(e) }}><img src={FacebookIcon} className="tw-logo"></img></button>
                            <button alt="share on telegram" className="share-button" onClick={(e) => { shareOnTelegram(e) }}><img src={TelegramIcon} className="tw-logo"></img></button>
                            <button alt="share on whatsapp" className="share-button" onClick={(e) => { shareOnWpp(e) }}><img src={WhatsappIcon} className="tw-logo"></img></button>
                        </div>
                    </div>

                </div>
            }
            {
                mode === "unlimited" &&
                <div className="modal-content">
                    <div className="top-content">
                        <div className="title">
                            {
                                (language === "english") && <h2>UNLIMITED STATISTICS</h2>
                            }
                            {
                                (language === "spanish") && <h2>ESTADISTICAS SIN LIMITES</h2>
                            }
                            {
                                (language === "portuguese") && <h2>ESTATISTICAS SEM LIMITES</h2>
                            }
                        </div>
                        <div className="close-button-container">
                            <button className="close-button" onClick={(e) => { changeStatsModal(e) }}>X</button>
                        </div>
                    </div>
                    {/* <div className="mode-button-container">
                        <button className="daily-button" onClick={() => { setMode("daily") }}>DAILY</button>
                        <button className="ul-button" onClick={() => { setMode("unlimited") }}>UNLIMITED</button>
                    </div> */}
                    <div className="stats-container">
                        <div className="stats-item-container">
                            <p className="stats-item">{playedUL ? playedUL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Played" : language === "portuguese" ? "Jogados" : "Jugados"}</p>
                        </div>
                        <div className="stats-item-container">
                            <p className="stats-item">{wonUL ? wonUL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Won" : language === "portuguese" ? "Vencidos" : "Ganados"}</p>
                        </div>
                        <div className="stats-item-container">
                            <p className="stats-item">{currentStreakUL ? currentStreakUL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Current streak" : language === "portuguese" ? "Série \n de vitórias" : "Racha \n de victorias"}</p>
                        </div>
                        <div className="stats-item-container">
                            <p className="stats-item">{maxStreakUL ? maxStreakUL : 0}</p>
                            <p className="stats-descriptor">{language === "english" ? "Max streak" : language === "portuguese" ? "Record \n de vitórias" : "Record \n de victorias"}</p>
                        </div>
                    </div>
                    <div className="stats-graph">
                        <div className="graph-item-container">
                            <div className="graph-item">1</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressUL[0] + '%' }}></div></div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">2</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressUL[1] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">3</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressUL[2] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">4</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressUL[3] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">5</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressUL[4] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">6</div>
                            <div className="progress-container">
                                <div className="progress" style={{ width: progressUL[5] + '%' }}></div>
                            </div>
                        </div>
                        <div className="graph-item-container">
                            <div className="graph-item">X</div>
                            <div className="progress-container">
                                <div className="lost" style={{ width: progressUL[6] + '%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="over-container">
                        <div className="share-container">
                        </div><div className="share-container">
                            <button alt="share on twitter" className="share-button" onClick={(e) => { shareOnTwitter(e) }}><img src={TwitterLogo} className="tw-logo"></img></button>
                            <button alt="share on facebook" className="share-button" onClick={(e) => { shareOnFb(e) }}><img src={FacebookIcon} className="tw-logo"></img></button>
                            <button alt="share on telegram" className="share-button" onClick={(e) => { shareOnTelegram(e) }}><img src={TelegramIcon} className="tw-logo"></img></button>
                            <button alt="share on whatsapp" className="share-button" onClick={(e) => { shareOnWpp(e) }}><img src={WhatsappIcon} className="tw-logo"></img></button>
                        </div>
                        <div className="share-container">
                            <button className="play-again-button" id="/unlimited" onClick={(e) => refreshBoard(e)}>{language === "english" ? "PLAY AGAIN" : language === "portuguese" ? "JOGAR DE NOVO" : "JUGAR DE NUEVO"}</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}