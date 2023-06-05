import React, { useEffect, createContext, useState } from "react";
import axios from "axios";


export const AppContext = createContext();

export default function AppContextProvider(props) {

    const [showPopUp, setPopUp] = useState({popup: false})

    const [currentTry, setCurrentTry] = useState({
        currentRow: 0,
        currentPos: 0,
        gameOver: false,
        incorrect: [],
        wordleNumber: 0
    })

    const [statsModal, setStatsModal] = useState(false);


    const changeStatsModal = (e) => {
        e.preventDefault();
        if (statsModal === true) {
            setStatsModal(false);

        }
        if (statsModal === false) {
            setStatsModal(true);


        }
    }

    const [language, setLanguage] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "english")

    const firstRowArray = Array.from("QWERTYUIOP");
    const secondRowArray = Array.from("ASDFGHJKL");
    const thirdRowArray = Array.from("ENTER Z X C V B N M ⌫".split(" "));

    const [board, setBoard] = useState([
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]]
    ])

    const [wordState, setWordState] = useState({
        allWords: [],
        correctWord: "",
    })

    const location = window.location.pathname;

    const refreshBoard = (e) => {
        e.preventDefault();
        const version = language === "english" ? "engVersion" : language === "portuguese" ? "brVersion" : "spanishVersion"
        if (localStorage.getItem([version])) {
            const storedState = JSON.parse(localStorage.getItem([version]));
            location === "/" ?
                localStorage.setItem([version], JSON.stringify({
                    ...storedState,
                    boardDL: "",
                    lastPlayed: new Date().setHours(0, 0, 0, 0),
                    overDL: false,
                    incorrectDL: JSON.stringify([]),
                    rowDL: 0,
                }))
                :
                localStorage.setItem([version], JSON.stringify({
                    ...storedState,
                    boardUL: "",
                    overUL: false,
                    incorrectUL: JSON.stringify([]),
                    rowUL: 0,
                }))
            changeLocation(e);
        }
        else {
            return
        }
    }

    const changeLocation = (e) => {
        e.preventDefault();
        window.location.pathname = e.target.id;
    }
    const changeLanguage = (e) => {
        e.preventDefault();
        setLanguage(e.target.id)
    }

    useEffect(() => {
        const version = language === "english" ? "engVersion" : language === "portuguese" ? "brVersion" : "spanishVersion"
        localStorage.setItem("language", language)
        axios.get(`https://wordleul-server-production.up.railway.app/words/${language}`)
            .then(res => {

                const words = res.data;

                if (location === "/") {
                    const storedState = JSON.parse(localStorage.getItem([version]))
                    const today = new Date().setHours(0, 0, 0, 0)
                    const seed = Math.round((new Date().setHours(0, 0, 0, 0) - new Date("7 April 2022").setHours(0, 0, 0, 0)) / 864e5);
                    const todaysWord = words[seed % words.length]
                    const dailyBoard = storedState && storedState.boardDL;
                    const lastPlayed = storedState && storedState.lastPlayed;
                    const dailyRow = storedState && storedState.rowDL;
                    const dailyOver = storedState && storedState.overDL;
                    const dailyIncorrect = storedState && storedState.incorrectDL;
                    const dailyPlayed = storedState ? storedState.playedDL : 0
                    const dailyWon = storedState ? storedState.wonDL : 0
                    const dailyStreak = storedState ? storedState.streakDL : false
                    const dailyCurrentStreak = storedState ? storedState.currentStreakDL : 0
                    const dailyMaxStreak = storedState ? storedState.maxStreakDL : 0
                    const dailyGraphData = storedState ? storedState.graphDataDL : [0, 0, 0, 0, 0, 0]
                    const unlimitedGraphData = storedState ? storedState.graphDataUL : [0, 0, 0, 0, 0, 0]

                    setWordState((prevState) => ({ allWords: words, correctWord: todaysWord, wordleNumber: today / 864e5 - new Date("7 April 2022").setHours(0, 0, 0, 0) / 864e5}))

                    if (!dailyBoard || dailyBoard === "" || lastPlayed !== today) {
                        setBoard([
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]]
                        ])
                        setCurrentTry({
                            currentRow: 0,
                            currentPos: 0,
                            gameOver: false,
                            incorrect: []
                        })
                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardDL: "",
                            lastPlayed: today,
                            overDL: false,
                            incorrectDL: JSON.stringify([]),
                            rowDL: 0,
                            playedDL: dailyPlayed,
                            wonDL: dailyWon,
                            streakDL: dailyStreak,
                            currentStreakDL: dailyCurrentStreak,
                            maxStreakDL: dailyMaxStreak,
                            graphDataDL: dailyGraphData,
                            graphDataUL: unlimitedGraphData
                        }));
                    }

                    if (dailyBoard && dailyBoard !== "") {
                        setBoard((prevState) => (dailyBoard))
                        setCurrentTry((prevState) => (
                            {
                                ...currentTry,
                                currentRow: dailyRow,
                                gameOver: dailyOver,
                                incorrect: dailyIncorrect
                            }
                        ))
                    }
                }

                if (location === "/unlimited") {
                    const storedState = JSON.parse(localStorage.getItem([version]))
                    const unlimitedBoard = storedState && storedState.boardUL;
                    const unlimitedRow = storedState && storedState.rowUL;
                    const unlimitedOver = storedState && storedState.overUL;
                    const unlimitedIncorrect = storedState && storedState.incorrectUL;
                    const currentSolution = storedState && storedState.solution;
                    const unlimitedPlayed = storedState ? storedState.playedUL : 0
                    const unlimitedWon = storedState ? storedState.wonUL : 0
                    const unlimitedStreak = storedState ? storedState.streakUL : false
                    const unlimitedCurrentStreak = storedState ? storedState.currentStreakUL : 0
                    const unlimitedMaxStreak = storedState ? storedState.maxStreakUL : 0
                    const unlimitedGraphData = storedState ? storedState.graphDataUL : [0, 0, 0, 0, 0, 0]
                    const dailyGraphData = storedState ? storedState.graphDataDL : [0, 0, 0, 0, 0, 0]


                    setWordState((prevState) => ({ ...prevState, allWords: words }))

                    if (!unlimitedBoard || unlimitedBoard === "" || unlimitedOver === "true") {
                        const solution = words[Math.round(Math.random() * words.length)];
                        setWordState((prevState) => ({ ...prevState, correctWord: solution }))

                        setBoard([
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]],
                            [[""], [""], [""], [""], [""]]
                        ])

                        setCurrentTry({
                            currentRow: 0,
                            currentPos: 0,
                            gameOver: false,
                            incorrect: []
                        })

                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardUL: "",
                            overUL: false,
                            incorrectUL: JSON.stringify([]),
                            rowUL: 0,
                            solution: solution,
                            playedUL: unlimitedPlayed,
                            wonUL: unlimitedWon,
                            streakUL: unlimitedStreak,
                            currentStreakUL: unlimitedCurrentStreak,
                            maxStreakUL: unlimitedMaxStreak,
                            graphDataUL: unlimitedGraphData,
                            graphDataDL: dailyGraphData,
                        }));
                    }

                    if (unlimitedBoard && unlimitedBoard !== "" && unlimitedOver !== "true") {
                        setWordState((prevState) => ({ ...prevState, correctWord: currentSolution }))
                        setBoard((prevState) => (unlimitedBoard))
                        setCurrentTry((prevState) => (
                            {
                                ...currentTry,
                                currentRow: unlimitedRow,
                                gameOver: unlimitedOver,
                                incorrect: unlimitedIncorrect
                            }
                        ))
                    }
                }
            })
    }, [location, language])

    const onBackspace = (e) => {
        if (currentTry.gameOver === true) return;
        if (currentTry.currentPos > 0) {
            board[currentTry.currentRow][currentTry.currentPos - 1] = "";
            setBoard([...board]);
            setCurrentTry((prevState) => ({
                ...prevState,
                currentPos: prevState.currentPos - 1
            }))
        }
        if (currentTry.currentPos === 0 && currentTry.currentRow < 6) {
            board[currentTry.currentRow][currentTry.currentPos] = "";
            setBoard([...board]);
        }
    }

    const onEnter = (e) => {
        const version = language === "english" ? "engVersion" : language === "portuguese" ? "brVersion" : "spanishVersion"
        const storedState = JSON.parse(localStorage.getItem([version]))

        if (currentTry.gameOver === true) return;
        if (currentTry.currentPos < 5) return;
        if (currentTry.currentPos === 5 && currentTry.gameOver !== true) {

            var guess = ""

            for (let i = 0; i < 5; i++) {
                guess = guess + board[currentTry.currentRow][i];
            }

            if (wordState.allWords.includes(guess.toLowerCase())) {

                for (let j = 0; j < wordState.correctWord.length; j++) {
                    if (!wordState.correctWord.includes(guess[j].toLowerCase())) {
                        currentTry.incorrect.push(guess[j])
                    }
                }

                location === "/unlimited" ? localStorage.setItem([version], JSON.stringify({
                    ...storedState,
                    incorrectUL: currentTry.incorrect
                })) :
                    localStorage.setItem([version], JSON.stringify({
                        ...storedState,
                        incorrectDL: currentTry.incorrect
                    }));


                if (guess.toLowerCase() === wordState.correctWord) {
                    console.log("que el popup te lleve a las stats y te tire para compartir");

                    const newGraphDL = storedState.graphDataDL;
                    const newGraphUL = storedState.graphDataUL;

                    if (location === "/") {
                        newGraphDL[storedState.rowDL] = storedState.graphDataDL[storedState.rowDL] + 1
                    }
                    if (location === "/unlimited") {
                        newGraphUL[storedState.rowUL] = storedState.graphDataUL[storedState.rowUL] + 1
                    }

                    location === "/unlimited" ?
                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardUL: board,
                            rowUL: currentTry.currentRow + 1,
                            overUL: true,
                            playedUL: storedState.playedUL ? storedState.playedUL + 1 : 1,
                            wonUL: storedState.wonUL ? storedState.wonUL + 1 : 1,
                            streakUL: true,
                            currentStreakUL: storedState.streakUL ? storedState.currentStreakUL + 1 : 1,
                            maxStreakUL: (storedState.streakUL && storedState.maxStreakUL) ? storedState.maxStreakUL + 1 : (storedState.streakUL === false && storedState.maxStreakUL) ? storedState.maxStreakUL : 1,
                            graphDataUL: newGraphUL,
                        })) :
                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardDL: board,
                            rowDL: currentTry.currentRow + 1,
                            overDL: true,
                            playedDL: storedState.playedDL ? storedState.playedDL + 1 : 1,
                            wonDL: storedState.wonDL ? storedState.wonDL + 1 : 1,
                            streakDL: true,
                            currentStreakDL: storedState.streakDL ? storedState.currentStreakDL + 1 : 1,
                            maxStreakDL: (storedState.streakDL && storedState.maxStreakDL) ? storedState.maxStreakDL + 1 : (storedState.streakDL === false && storedState.maxStreakDL) ? storedState.maxStreakDL : 1,
                            graphDataDL: newGraphDL
                        }));

                    setCurrentTry((prevState) => ({ ...prevState, currentRow: prevState.currentRow + 1, gameOver: true }))

                    const modalInterval = setInterval(() => {
                        setStatsModal(true)
                        clearInterval(modalInterval)

                    }, 2000)


                    return
                }
                if (currentTry.currentRow === 5 && guess.toLowerCase() !== wordState.correctWord) {

                    const storedState = JSON.parse(localStorage.getItem([version]))
                    console.log(`hace modal que indique que la palabra era ${wordState.correctWord}`)

                    location === "/unlimited" ?
                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardUL: board,
                            rowUL: currentTry.currentRow + 1,
                            overUL: true,
                            playedUL: storedState.playedUL ? storedState.playedUL + 1 : 1,
                            wonUL: storedState.wonUL ? storedState.wonUL : 0,
                            streakUL: false,
                            currentStreakUL: 0,
                            maxStreakUL: storedState.maxStreakUL ? storedState.maxStreakUL : 0
                        })) :
                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardDL: board,
                            rowDL: currentTry.currentRow + 1,
                            overDL: true,
                            playedDL: storedState.playedDL ? storedState.playedDL + 1 : 1,
                            wonDL: storedState.wonDL ? storedState.wonDL : 0,
                            streakDL: false,
                            currentStreakDL: 0,
                            maxStreakDL: storedState.maxStreakDL ? storedState.maxStreakDL : 0
                        }));

                    setCurrentTry((prevState) => ({ ...prevState, currentRow: prevState.currentRow + 1, gameOver: true }))

                    const modalInterval = setInterval(() => {
                        setStatsModal(true)
                        clearInterval(modalInterval)

                    }, 2000)

                    return
                }
                if (currentTry.currentRow < 5) {

                    const storedState = JSON.parse(localStorage.getItem([version]))

                    location === "/unlimited" ?
                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardUL: board,
                            rowUL: currentTry.currentRow + 1
                        })) :
                        localStorage.setItem([version], JSON.stringify({
                            ...storedState,
                            boardDL: board,
                            rowDL: currentTry.currentRow + 1
                        }));
                    setCurrentTry((prevState) => ({ ...prevState, currentRow: prevState.currentRow + 1, currentPos: 0 }))
                }
            }
            if (!wordState.allWords.includes(guess.toLowerCase())) {
                console.log("hace modal que diga que la palabra no está")
                setPopUp({popup: true});
            }
        }
    }

    const onLetterPress = (e) => {
        if (e.key === "Delete") return;
        if (currentTry.gameOver === true) return;
        if (currentTry.currentPos < 5 && currentTry.currentRow < 6) {
            e.key ? board[currentTry.currentRow][currentTry.currentPos] = e.key.toUpperCase() : board[currentTry.currentRow][currentTry.currentPos] = e.target.id
            setCurrentTry((prevState) => ({
                ...prevState,
                currentPos: prevState.currentPos + 1
            }))

        }
    }

    const onEscape = (e) => {
        if (true) {
            console.log("Escape")
            console.log(wordState.correctWord)
        }
    }


    return (
        <AppContext.Provider value={[board, setBoard, currentTry, setCurrentTry, wordState, setWordState, onBackspace, onEnter, onLetterPress, onEscape, firstRowArray, secondRowArray, thirdRowArray, language, changeLocation, changeLanguage, statsModal, changeStatsModal, refreshBoard, showPopUp, setPopUp]}>
            {props.children}
        </AppContext.Provider>
    )

}