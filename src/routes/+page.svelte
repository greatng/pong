<script lang="ts">
    import {
        COMPUTER_LEVEL,
        DIFFICULTY,
        WINNER_STATUS,
        type PlayerState,
        type BallState
    } from '$lib/index.js';
    import { onMount } from 'svelte';

    let resetGame: () => void;
    let computerLevel = COMPUTER_LEVEL.Easy;
    let difficulty = DIFFICULTY.EASY;
    let changeComputerLevel = (): void => {
        if (difficulty === DIFFICULTY.EASY) {
            difficulty = DIFFICULTY.MEDIUM;
        } else if (difficulty === DIFFICULTY.MEDIUM) {
            difficulty = DIFFICULTY.HARD;
        } else {
            difficulty = DIFFICULTY.EASY;
        }
        computerLevel = COMPUTER_LEVEL[difficulty];
    };
    let winner = WINNER_STATUS.RESET;

    onMount(() => {
        const canvas = document.getElementsByTagName('canvas')[0];
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        const userInitalState: PlayerState = {
            x: 0,
            y: (canvas.height - 100) / 2,
            width: 10,
            height: 200,
            score: 0,
            color: 'WHITE'
        };

        const comInitalState: PlayerState = {
            x: canvas.width - 10,
            y: (canvas.height - 100) / 2,
            width: 10,
            height: 100,
            score: 0,
            color: '#E74C3C'
        };

        const ball: BallState = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 20,
            velocityX: 5,
            velocityY: 5,
            speed: 5,
            color: '#FFD700'
        };
        let user = { ...userInitalState };
        let com = { ...comInitalState };
        const net = {
            x: (canvas.width - 2) / 2,
            y: 0,
            height: 10,
            width: 2,
            color: '#ADFF2F'
        };

        resetGame = () => {
            com = { ...comInitalState };
            user = { ...userInitalState };
            resetBall();
        };

        const drawRect = (
            x: number,
            y: number,
            w: number,
            h: number,
            color: string
        ) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        };

        const drawRectWithGradient = (
            x: number,
            y: number,
            w: number,
            h: number
        ) => {
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, '#205072');
            gradient.addColorStop(0.5, '#329D9C');
            gradient.addColorStop(1, '#56C596');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, w, h);
        };

        const drawArc = (x: number, y: number, r: number, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        };
        const drawText = (
            text: string | number,
            x: number,
            y: number,
            color: string
        ) => {
            ctx.fillStyle = color;
            ctx.font = '600px sans-serif';
            ctx.fillText(text.toString(), x, y);
        };
        const render = () => {
            drawRectWithGradient(0, 0, canvas.width, canvas.height);
            drawText(user.score, 50, canvas.height - 100, '#222');
            drawText(
                com.score,
                canvas.width / 2 + 50,
                canvas.height - 100,
                '#222'
            );
            drawNet();
            drawRect(user.x, user.y, user.width, user.height, user.color);
            drawRect(com.x, com.y, com.width, com.height, com.color);
            drawArc(ball.x, ball.y, ball.radius, ball.color);
        };
        const collision = (b: BallState, p: PlayerState) => {
            b.top = b.y - b.radius;
            b.bottom = b.y + b.radius;
            b.left = b.x - b.radius;
            b.right = b.x + b.radius;
            p.top = p.y;
            p.bottom = p.y + p.height;
            p.left = p.x;
            p.right = p.x + p.width;
            return (
                p.left < b.right &&
                p.top < b.bottom &&
                p.right > b.left &&
                p.bottom > b.top
            );
        };
        const resetBall = () => {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.velocityX = -ball.velocityX;
            ball.speed = 10;
        };
        const update = () => {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
            if (
                ball.y + ball.radius > canvas.height ||
                ball.y - ball.radius < 0
            ) {
                ball.velocityY = -ball.velocityY;
            }
            let player = ball.x < canvas.width / 2 ? user : com;

            if (collision(ball, player)) {
                let collidePoint = ball.y - (player.y + player.height / 2);
                collidePoint = collidePoint / (player.height / 2);
                let angleRad = (Math.PI / 4) * collidePoint;
                let direction = ball.x < canvas.width / 2 ? 1 : -1;
                ball.velocityX = direction * ball.speed * Math.cos(angleRad);
                ball.velocityY = ball.speed * Math.sin(angleRad);
                ball.speed += 0.1;
            }
            if (ball.x - ball.radius < 0) {
                com.score++;
                resetBall();
            } else if (ball.x + ball.radius > canvas.width) {
                user.score++;
                resetBall();
            }

            if (user.score === 10 || com.score === 10) {
                const WINNER_TIMEOUT = 10000;

                alert('Game Over');
                winner =
                    user.score === 10 ? WINNER_STATUS.WON : WINNER_STATUS.LOST;
                resetGame();
                setTimeout(() => {
                    winner = WINNER_STATUS.RESET;
                }, WINNER_TIMEOUT);
            }
        };
        const game = () => {
            update();
            render();
        };
        const fps = 60;
        setInterval(game, 1000 / fps);
        const movePaddle = (e: MouseEvent | TouchEvent) => {
            let rect = canvas.getBoundingClientRect();
            if (e instanceof MouseEvent) {
                user.y = e.clientY - rect.top - user.height / 2;
            } else {
                const touch = e.changedTouches;
                for (let i = 0; i < touch.length; i++) {
                    user.y = touch[i].clientY - rect.top - user.height / 2;
                }
            }
        };
        canvas.addEventListener('mousemove', movePaddle);
        canvas.addEventListener('touchmove', movePaddle);
        const drawNet = () => {
            for (let i = 0; i <= canvas.height; i += 15) {
                drawRect(net.x, net.y + i, net.width, net.height, net.color);
            }
        };
    });
</script>

<div
    class="flex flex-col items-center w-screen h-screen bg-slate-700 justify-center"
>
    <p class="font-medium text-4xl text-gray-100 my-5">
        Welcome to PONG in Svelte
    </p>
    <p class="text-slate-200 h-8">{winner}</p>
    <canvas class="bg-gray-100" width="800" height="600" />
    <div class="flex flex-col items-center justify-evenly">
        <p class="font-medium text-4xl text-gray-100">
            Move your mouse to play, first to 10 wins!
        </p>
        <p class="text-gray-100 my-3">{difficulty}</p>
        <button
            on:click={changeComputerLevel}
            class="bg-teal-600 text-gray-100 font-medium px-4 py-2 rounded-md shadow-xl hover:bg-teal-500 transition duration-300 ease-in-out my-1"
            >Change Computer Level
        </button>
        <button
            on:click={resetGame}
            class="bg-teal-600 text-gray-100 font-medium px-4 py-2 rounded-md shadow-xl hover:bg-teal-500 transition duration-300 ease-in-out my-1"
            >Reset Game
        </button>
    </div>
</div>
