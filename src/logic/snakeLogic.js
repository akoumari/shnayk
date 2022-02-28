const xAxis = new Map([
    ["ArrowLeft", -1],
    ["ArrowRight", 1],
]);
const yAxis = new Map([
    ["ArrowUp", -1],
    ["ArrowDown", 1],
]);
const checkGameOver = (snake, newSnake, setSnake, hasWalls) => {
    if (
        snake.body
            .slice(2)
            .filter(part => part.x == snake.head.x && part.y == snake.head.y)
            .length >= 1
    ) {
        return setSnake({ ...newSnake, gameOver: true });
    }
    if (
        hasWalls &&
        (Math.abs(snake.head.x - newSnake.head.x) > 1 ||
            Math.abs(snake.head.y - newSnake.head.y) > 1)
    ) {
        return setSnake({ ...snake, gameOver: true });
    }
    return setSnake(newSnake);
};
const moveBody = (body, head) => {
    let newbody = [...body];
    for (let i = body.length - 1; i > 0; i--) {
        newbody[i] = newbody[i - 1];
    }
    newbody[0] = head;
    return newbody;
};
const getNext = next => {
    if (next > 49) return 0;
    if (next < 0) return 49;
    return next;
};
const moveX = (key, snake, setSnake, input, setInput, hasWalls) => {
    let change = xAxis.get(key);
    setInput({ ...input, waitOnFrame: false });
    let newbody = moveBody(snake.body, { x: snake.head.x, y: snake.head.y });
    let newSnake = {
        ...snake,
        body: newbody,

        pause: false,
        moving: key,
        head: {
            ...snake.head,
            x: getNext(snake.head.x + change),
            nextX: snake.head.x + 2 * change,
        },
    };
    return checkGameOver(snake, newSnake, setSnake, hasWalls);
};
const moveY = (key, snake, setSnake, input, setInput, hasWalls) => {
    let change = yAxis.get(key);
    setInput({ ...input, waitOnFrame: false });
    let newbody = moveBody(snake.body, { x: snake.head.x, y: snake.head.y });
    let newSnake = {
        ...snake,
        body: newbody,
        pause: false,
        moving: key,
        head: {
            ...snake.head,
            y: getNext(snake.head.y + change),
            nextY: snake.head.y + 2 * change,
        },
    };

    return checkGameOver(snake, newSnake, setSnake, hasWalls);
};
const pause = (snake, setSnake) => {
    if (snake.gameOver) return setSnake(DEFAULT_SNAKE);
    setSnake({ ...snake, pause: !snake.pause });
};
const getValidAction = (key, snake, input, setInput) => {
    if (xAxis.has(key) && !xAxis.has(snake.moving) && !input.waitOnFrame) {
        return setInput({ moving: key, waitOnFrame: true });
    }
    if (yAxis.has(key) && !yAxis.has(snake.moving) && !input.waitOnFrame) {
        console.log(key);
        return setInput({ moving: key, waitOnFrame: true });
    }
};

export const newFrame = (snake, setSnake, input, setInput, hasWalls) => {
    const { moving } = input;
    if (xAxis.has(moving)) {
        return moveX(moving, snake, setSnake, input, setInput, hasWalls);
    }
    if (yAxis.has(moving)) {
        console.log(moving);
        return moveY(moving, snake, setSnake, input, setInput, hasWalls);
    }
};
export const snakeSnacks = (snake, setSnake) => {
    let newbody = [...snake.body];
    newbody.push(newbody[newbody.length - 1]);
    let newSnake = {
        ...snake,
        body: newbody,
    };
    return setSnake(newSnake);
};
export const newFood = snake => {
    let food = {
        x: Math.floor(Math.random() * 50),
        y: Math.floor(Math.random() * 50),
    };
    while (
        snake.body.filter(part => part.x == food.x && part.y == food.y)
            .length >= 1
    ) {
        food = {
            x: Math.floor(Math.random() * 51),
            y: Math.floor(Math.random() * 51),
        };
    }
    return food;
};

export const DEFAULT_SPEED = 100;
export const DEFAULT_SNAKE = {
    head: {
        x: 25,
        y: 25,
        nextX: 26,
        nextY: 25,
    },
    moving: "ArrowLeft",
    pause: true,
    waitOnFrame: false,
    gameOver: false,
    length: 2,
    body: [...Array(2)].map((_, j) => {
        return {
            x: 25,
            y: 25,
        };
    }),
};
export const DEFAULT_INPUT = {
    moving: "ArrowLeft",
    waitOnFrame: false,
};
export const DEFAULT_GRID = [...Array(50)].map((_, i) => {
    let inner = [...Array(50)].map((_, j) => {
        return {
            hasSnk: false,
            hasFood: false,
            x: i,
            y: j,
            isEdge: false,
            moveTo: null,
            hasHead: false,
        };
    });
    return inner;
});
export const getPlayerInput = (key, snake, input, setInput, setSnake) => {
    if (key == " ") return pause(snake, setSnake);
    return getValidAction(key, snake, input, setInput);
};
