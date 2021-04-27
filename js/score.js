export class Score {
    constructor() {
        this.score = 0;
    }
    getScore() {
        return this.score;
    }
    updateScore(score) {
        this.score = this.score + score;
        return this.score;
    }
    clearScore() {
        this.score = 0;
        return this.score;
    }
}
