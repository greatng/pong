<script lang="ts">
	import { onMount } from 'svelte';

	let resetGame: () => void;
	onMount(() => {
	const canvas = document.getElementsByTagName('canvas')[0];
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');
	const ball = {
		x: canvas.width / 2,
		y: canvas.height / 2,
		radius: 20,
		velocityX: 5,
		velocityY: 5,
		speed: 5,
		color: '#FFD700'
	}
	const user = {
		x: 0,
		y: (canvas.height - 100) / 2,
		width: 10,
		height: 200,
		score: 0,
		color: 'WHITE'
	}
	const com = {
		x: canvas.width - 10,
		y: (canvas.height - 100) / 2,
		width: 10,
		height: 100,
		score: 0,
		color: '#E74C3C'
	}
	const net = {
		x: (canvas.width - 2) / 2,
		y: 0,
		height: 10,
		width: 2,
		color: '#ADFF2F'
	}
	const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}
	const drawArc = (x: number, y: number, r: number, color: string) => {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}
	const drawText = (text: string | number, x: number, y: number, color: string) => {
		ctx.fillStyle = color;
		ctx.font = '600px sans-serif';
		ctx.fillText(text.toString(), x, y);
	}
	const render = () => {
		drawRect(0, 0, canvas.width, canvas.height, 'BLACK');
		drawText(user.score, 50, canvas.height - 100, '#333');
		drawText(com.score, (canvas.width / 2) + 50, canvas.height - 100, '#333');
		drawNet();
		drawRect(user.x, user.y, user.width, user.height, user.color);
		drawRect(com.x, com.y, com.width, com.height, com.color);
		drawArc(ball.x, ball.y, ball.radius, ball.color);
	}
	const collision = (b: any, p: any) => {
		b.top = b.y - b.radius;
		b.bottom = b.y + b.radius;
		b.left = b.x - b.radius;
		b.right = b.x + b.radius;
		p.top = p.y;
		p.bottom = p.y + p.height;
		p.left = p.x;
		p.right = p.x + p.width;
		return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
	}
	const resetBall = () => {
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.velocityX = -ball.velocityX;
		ball.speed = 10;
	}
	const update = () => {
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		let computerLevel = 0.05;
		com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
		if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
			ball.velocityY = -ball.velocityY;
		}
		let player = (ball.x < canvas.width / 2) ? user : com;
		if (collision(ball, player)) {
			let collidePoint = (ball.y - (player.y + player.height / 2));
			collidePoint = collidePoint / (player.height / 2);
			let angleRad = (Math.PI / 4) * collidePoint;
			let direction = (ball.x < canvas.width / 2) ? 1 : -1;
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
	}
	const game = () => {
		update();
		render();
	}
	const fps = 60;
	setInterval(game, 1000 / fps);
	const movePaddle = (e: MouseEvent) => {
		let rect = canvas.getBoundingClientRect();
		user.y = e.clientY - rect.top - user.height / 2;
	}
	canvas.addEventListener('mousemove', movePaddle);
	const drawNet = () => {
		for (let i = 0; i <= canvas.height; i += 15) {
			drawRect(net.x, net.y + i, net.width, net.height, net.color);
		}
	}
	resetGame = () => {
		com.score = 0;
		user.score = 0;
		resetBall();
	}
	})
</script>

<div class="flex flex-col items-center w-screen h-screen bg-slate-700 justify-center">
	<p class="font-medium text-4xl text-gray-100 my-5">Welcome to PONG in Svelte</p>
	<canvas width="800" height="600" class="bg-gray-100"></canvas>
	<p class="font-medium text-4xl text-gray-100 my-5">Move your mouse to play</p>
	<button on:click={resetGame} class="bg-teal-600 text-gray-900 font-medium px-4 py-2 rounded-md">Reset Ball</button>
</div>