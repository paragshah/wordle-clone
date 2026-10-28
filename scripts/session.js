class WordleSession {
    session = {};
    #localStorageName = "session";
    #MAX_GUESS_LENGTH = 5;
    #MAX_NUM_OF_GUESSES = 6;

    constructor() {
        this.#loadSession();
    }

    getGuesses() {
        return this.session.guesses;
    }

    saveGuess(guess) {
        if (guess.length != this.#MAX_GUESS_LENGTH) {
            console.error("Cannot save guess to local storage. Wrong length.");
            return;
        }

        if (this.session.guesses.length >= this.#MAX_NUM_OF_GUESSES) {
            console.error("Cannot save guess to local storage. Max number of guesses reached.");
            return;
        }

        this.session.guesses.push(guess);

        try {
            localStorage.setItem(this.#localStorageName, JSON.stringify(this.session));
        }
        catch (err) {
            console.error("Unable to save session to local storage:\n" + err);
        }
    }

    getWord() {
        return this.session.word;
    }

    saveWord(word) {
        // when saving the word, we assume this is a start of a new game,
        // so clear number of guesses
        this.session = {
            guesses: [],
            word: word
        }

        try {
            localStorage.setItem(this.#localStorageName, JSON.stringify(this.session));
        }
        catch (err) {
            console.error("Unable to save word to local storage:\n" + err);
        }
    }

    clearSession() {
        this.session = {
            guesses: undefined,
            word: undefined
        }

        try {
            localStorage.setItem(this.#localStorageName, JSON.stringify(this.session));
        }
        catch (err) {
            console.error("Unable to clear session from local storage:\n" + err);
        }
    }

    #loadSession() {
        this.session = {
            guesses: [],
            word: ""
        };

        let sessionStr = localStorage.getItem(this.#localStorageName);
        if (sessionStr && sessionStr.length) {
            try {
                this.session = JSON.parse(sessionStr);
                this.session.guesses ??= [];
                this.session.word ??= "";
            }
            catch (err) {
                console.error("Unable to retrieve session from local storage:\n" + err);
            }
        }
    }
}
