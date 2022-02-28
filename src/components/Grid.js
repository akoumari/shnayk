import React, { useEffect, useMemo, useState } from "react";
import useKeypress from "react-use-keypress";
import {
    getPlayerInput,
    newFrame,
    snakeSnacks,
    newFood,
    DEFAULT_SNAKE,
    DEFAULT_SPEED,
    DEFAULT_INPUT,
    DEFAULT_GRID,
} from "../logic/snakeLogic";
import useInterval from "@use-it/interval";
const Grid = () => {
    const [snake, setSnake] = useState(DEFAULT_SNAKE);
    const [input, setInput] = useState(DEFAULT_INPUT);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);
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
                                part => part.x == col.x && part.y == col.y
                            )?.length >= 1,
                        hasFood: food.x == col.x && food.y == col.y,
                        hasHead: snake.head.x == col.x && snake.head.y == col.y,
                    };
                });
                return [...inner];
            }),
        ]);
    }, [snake, food]);
    useEffect(() => {
        const { x: headX, y: headY } = snake.head;
        const { x, y } = food;

        if (headX == x && headY == y && !pauseFood) {
            setPauseFood(true);
            setFood(newFood(snake));
            snakeSnacks(snake, setSnake);
        }
        setPauseFood(false);
    }, [snake]);
    useInterval(() => {
        if (!snake.pause && !snake.gameOver)
            newFrame(snake, setSnake, input, setInput, hasWalls);
    }, speed);
    const gridUI = useMemo(() => {
        console.log("change snake");

        return (
            <div className={`grid-container`}>
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
    }, [grid, snake]);
    useEffect(() => {
        setScore((snake.body.length - 2) * 100);
    }, [snake]);

    useEffect(() => {
        if (score > highScore) {
            localStorage.setItem("score", score);
            setHighScore(score);
        }
    }, [score]);
    return (
        <div className={``}>
            <div className="sidebar">
                <div>{snake.gameOver ? "GAME OVER" : `Score: ${score}`}</div>
                <div>High Score: {highScore}</div>
                <button
                    className={`mode mb ${hasWalls ? "active-mode" : ""}`}
                    onClick={() => {
                        setHasWalls(!hasWalls);
                    }}
                >
                    Walls: {hasWalls ? "ON" : "OFF"}
                </button>
                <button
                    className={`mode ${speed == 150 ? "active-mode" : ""}`}
                    onClick={() => {
                        setSpeed(150);
                    }}
                >
                    easy
                </button>
                <button
                    className={`mode ${speed == 100 ? "active-mode" : ""}`}
                    onClick={() => {
                        setSpeed(DEFAULT_SPEED);
                    }}
                >
                    medium
                </button>
                <button
                    className={`mode ${speed == 50 ? "active-mode" : ""}`}
                    onClick={() => {
                        setSpeed(50);
                    }}
                >
                    hard
                </button>
                <button
                    className={`mode ${speed == 10 ? "active-mode" : ""}`}
                    onClick={() => {
                        setSpeed(10);
                    }}
                >
                    GOD MODE
                </button>
            </div>
            {gridUI}
        </div>
    );
};

export default Grid;
