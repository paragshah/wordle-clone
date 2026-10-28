class WordleStats {
    gameCount = 0;
    winCount = 0;
    winStreak = 0;
    maxStreak = 0;
    guessDist = {1:0,2:0,3:0,4:0,5:0,6:0};
    #localStorageName = "stats";

    constructor() {
        this.loadStats();
    }

    loadStats() {
        let statsStr = localStorage.getItem(this.#localStorageName);
        if (statsStr && statsStr.length) {
            try {
                const stats = JSON.parse(statsStr);
                this.gameCount = stats.game_count;
                this.winCount = stats.win_count;
                this.winStreak = stats.win_streak;
                this.maxStreak = stats.max_streak;
                this.guessDist = stats.guess_dist;
            }
            catch (err) {
                console.error("Unable to fetch stats from local storage:\n" + err);
            }
        }
    }

    saveStats(didWin, numberOfGuesses = 6) {
        this.gameCount += 1;

        if (didWin) {
            this.winCount++;
            this.winStreak++;

            if (this.winStreak > this.maxStreak) {
                this.maxStreak++;
            }

            this.guessDist[""+numberOfGuesses] += 1;
        }
        else {
            this.winStreak = 0;
        }

        let stats = {
            game_count: this.gameCount,
            win_count: this.winCount,
            win_streak: this.winStreak,
            max_streak: this.maxStreak,
            guess_dist: this.guessDist
        };

        try {
            localStorage.setItem(this.#localStorageName, JSON.stringify(stats));
        }
        catch (err) {
            console.error("Unable to save stats to local storage:\n" + err);
        }
    }

    mostWon() {
        let mostWon = 0;
        for (let i in this.guessDist) {
            mostWon = Math.max(mostWon, this.guessDist[i]);
        }

        return mostWon;
    }

    winPercentage() {
        return this.gameCount > 0
            ? Math.round((this.winCount / this.gameCount) * 100)
            : 0;
    }
}
