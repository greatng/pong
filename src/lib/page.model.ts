export enum WINNER_STATUS {
    WON = 'You won!',
    LOST = 'You lost!',
    RESET = 'BATTLE!'
}

export enum DIFFICULTY {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard'
}

export enum COMPUTER_LEVEL {
    Easy = 0.05,
    Medium = 0.1,
    Hard = 0.2
}

export type Position = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

export type PlayerState = {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    color: string;
} & Position;

export type BallState = {
    x: number;
    y: number;
    radius: number;
    velocityX: number;
    velocityY: number;
    speed: number;
    color: string;
} & Position;
