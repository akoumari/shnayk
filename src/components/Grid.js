import React, { useEffect, useMemo, useState } from "react";
import useKeypress from "react-use-keypress";
import { FaPause } from "react-icons/fa";
import {
    BsArrowDownSquare,
    BsArrowLeftSquare,
    BsArrowRightSquare,
    BsArrowUpSquare,
} from "react-icons/bs";
import {
    getPlayerInput,
    newFrame,
    snakeSnacks,
    newFood,
    handleMode,
    DEFAULT_SNAKE,
    DEFAULT_SPEED,
    DEFAULT_INPUT,
    DEFAULT_GRID,
    DEFAULT_MODE,
} from "../logic/snakeLogic";
import useInterval from "@use-it/interval";
const Grid = () => {
    const [snake, setSnake] = useState(DEFAULT_SNAKE);
    const [input, setInput] = useState(DEFAULT_INPUT);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);
    const [mode, setMode] = useState(DEFAULT_MODE);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(
        Number(localStorage.getItem("score"))
    );
    const [hasWalls, setHasWalls] = useState(true);
    const [food, setFood] = useState(newFood(snake));
    const [pauseFood, setPauseFood] = useState(false);
    const [wait, setWait] = useState(false);
    const [grid, setGrid] = useState(DEFAULT_GRID);
    useKeypress(
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "],
        event => {
            event.preventDefault();

            if (!wait) {
                setWait(true);
                getPlayerInput(event.key, snake, input, setInput, setSnake);
                setWait(false);
            }
        }
    );
    useEffect(() => {
        console.log(snake);
        setGrid([
            ...grid.map(row => {
                let inner = row.map(col => {
                    return {
                        ...col,
                        hasSnk:
                            snake.body.filter(
                                part => part.x === col.x && part.y === col.y
                            )?.length >= 1,
                        hasFood: food.x === col.x && food.y === col.y,
                        hasHead:
                            snake.head.x === col.x && snake.head.y === col.y,
                    };
                });
                return [...inner];
            }),
        ]);
    }, [snake, food]);
    useEffect(() => {
        const { x: headX, y: headY } = snake.head;
        const { x, y } = food;

        if (headX === x && headY === y && !pauseFood) {
            setPauseFood(true);
            setFood(newFood(snake));
            snakeSnacks(snake, setSnake);
        }
        setPauseFood(false);
    }, [snake]);
    useEffect(() => {
        if (mode !== "progressive") handleMode(mode, setSpeed);
    }, [mode]);
    useEffect(() => {
        if (mode !== "progressive") return;
        if (score < 500 && speed !== 150) {
            handleMode("easy", setSpeed);
        }
        if (score < 1500 && score >= 500 && speed !== 100) {
            handleMode("medium", setSpeed);
        }
        if (score < 10500 && score >= 1500 && speed !== 150) {
            handleMode("hard", setSpeed);
        }
        if (score >= 10500 && speed !== 150) {
            handleMode("god", setSpeed);
        }
    }, [score, mode]);
    useInterval(() => {
        if (!snake.pause && !snake.gameOver)
            newFrame(snake, setSnake, input, setInput, hasWalls);
    }, speed);
    useEffect(() => {
        setScore((snake.body.length - 2) * 100);
    }, [snake]);

    useEffect(() => {
        if (score > highScore) {
            localStorage.setItem("score", score);
            setHighScore(score);
        }
    }, [score]);

    const gridUI = useMemo(() => {
        console.log("change snake");

        return (
            <div className={`grid-container ${hasWalls ? "walls" : ""}`}>
                {(snake.pause || snake.gameOver) && (
                    <div className={`paused`}>
                        <div className="pause-label-container ">
                            {" "}
                            <span className="pause-label pause-img ">
                                <FaPause></FaPause>
                            </span>{" "}
                            <span className="pause-label ">
                                Click spacebar to start{" "}
                                {snake.gameOver && "new game"}
                            </span>
                        </div>
                    </div>
                )}
                {grid.map(row => {
                    return row.map(col => {
                        return (
                            <div
                                key={`(${col.x}, ${col.y})`}
                                className={`grid-item ${
                                    col.hasFood ? "food" : ""
                                } ${col.hasSnk ? "snake-body" : ""}  ${
                                    col.hasHead ? "snake-head" : ""
                                }`}
                            ></div>
                        );
                    });
                })}
            </div>
        );
    }, [grid, snake, hasWalls]);

    return (
        <div className={``}>
            <div className={`score-container`}>
                <div className={`score-card`}>
                    <div>Score</div>
                    <div>{snake.gameOver ? "GAME OVER" : `${score}`}</div>
                </div>

                <div className={`score-card`}>
                    <div>High Score</div>
                    <div>{highScore}</div>
                </div>
            </div>
            <div
                className={`sidebar ${
                    !snake.gameOver && score > 0 ? "in-game" : ""
                }`}
            >
                <div>Game settings</div>

                <button
                    disabled={!snake.gameOver && score > 0}
                    className={`mode mb ${hasWalls ? "active-mode" : ""}`}
                    onClick={() => {
                        setHasWalls(!hasWalls);
                    }}
                >
                    Walls: {hasWalls ? "ON" : "OFF"}
                </button>
                <button
                    disabled={!snake.gameOver && score > 0}
                    className={`mode  ${
                        mode === "progressive" ? "active-mode" : ""
                    }`}
                    onClick={() => {
                        setMode("progressive");
                    }}
                >
                    progressive
                </button>
                <button
                    disabled={!snake.gameOver && score > 0}
                    className={`mode ${speed === 150 ? "active-mode" : ""}`}
                    onClick={() => {
                        setMode("easy");
                    }}
                >
                    easy
                </button>
                <button
                    disabled={!snake.gameOver && score > 0}
                    className={`mode ${speed === 100 ? "active-mode" : ""}`}
                    onClick={() => {
                        setMode("medium");
                    }}
                >
                    medium
                </button>
                <button
                    disabled={!snake.gameOver && score > 0}
                    className={`mode ${speed === 50 ? "active-mode" : ""}`}
                    onClick={() => {
                        setMode("hard");
                    }}
                >
                    hard
                </button>
                <button
                    disabled={!snake.gameOver && score > 0}
                    className={`mode ${speed === 10 ? "active-mode" : ""}`}
                    onClick={() => {
                        setMode("god");
                    }}
                >
                    GOD MODE
                </button>
            </div>
            <div className="sidebar-right">
                <div className="mb">Controls</div>
                <div>
                    <BsArrowRightSquare /> Right Arrow
                </div>
                <div>
                    <BsArrowLeftSquare /> Left Arrow
                </div>
                <div>
                    <BsArrowUpSquare /> Up Arrow
                </div>
                <div>
                    <BsArrowDownSquare /> Down Arrow
                </div>
                <div>
                    <FaPause /> Space Bar
                </div>
            </div>
            {gridUI}
        </div>
    );
};

export default Grid;
