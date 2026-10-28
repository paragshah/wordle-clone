// on document load
document.addEventListener("DOMContentLoaded", (ev) => init());

// globals
let gCurrentRow = 0;
let gCurrentCol = 0;
let gDidGuessFirstWord = false;
let gSession = {};
let gSettings;
let gShare = "";
let gStats;
let gToastFadeInTimeoutId;
let gToastFadeOutTimeoutId;

let word;

// custom events
const animationCompletedEvent = new Event(EVENT.ANIMATION_COMPLETED);

function init() {
    initSession();
    initSettings();
    initStats();
    initToast();
    enableToolbarListeners();
    enableKeyboardListeners();
    enableCustomListeners();
}

function initSession() {
    gSession = new WordleSession();

    const sessionWord = gSession.getWord();
    if (sessionWord && sessionWord.length) {
        gWord = sessionWord;
    }
    else {
        gWord = words[randomIntFromInterval(12546, 14855)];
        gSession.saveWord(gWord);
    }

    const guesses = gSession.getGuesses() ?? [];
    gDidGuessFirstWord = guesses.length > 0;
    updateSessionUI(guesses);
}

function initSettings() {
    gSettings = new WordleSettings();

    // hard mode
    const hardModeToggleEl = document.querySelector(SEL.TOGGLE_HARD_MODE);
    if (gSettings.hardMode) {
        hardModeToggleEl?.classList.add(CLASS.ON);
    }

    const containerEl = document.querySelector(SEL.CONTAINER);

    // dark theme
    const darkToggleEl = document.querySelector(SEL.TOGGLE_DARK_THEME);

    if (gSettings.darkTheme) {
        containerEl?.classList.replace(CLASS.LIGHT, CLASS.DARK);
        darkToggleEl?.classList.add(CLASS.ON);
    } else {
        containerEl?.classList.replace(CLASS.DARK, CLASS.LIGHT);
        darkToggleEl?.classList.remove(CLASS.ON);
    }

    // high contrast mode
    const highContrastToggleEl = document.querySelector(SEL.TOGGLE_HIGH_CONTRAST);

    if (gSettings.highContrastMode) {
        containerEl?.classList.add(CLASS.HIGH_CONTRAST);
        highContrastToggleEl?.classList.add(CLASS.ON);
    }
    else {
        containerEl?.classList.remove(CLASS.HIGH_CONTRAST);
        highContrastToggleEl?.classList.remove(CLASS.ON);
    }
}

function initStats() {
    gStats = new WordleStats();
}

function initToast() {
    const titleContainerEl = document.querySelector(SEL.TITLE_CONTAINER);
    const topOffset = titleContainerEl?.clientHeight ?? 0;
    const toastEl = document.querySelector(SEL.TOAST);

    // reposition toast slightly below the header
    toastEl.style.top = `${topOffset - 3}px`;
}

function enableToolbarListeners() {

    // help button
    const helpEl = document.querySelector(SEL.HELP);
    helpEl.addEventListener(EVENT.CLICK, (ev) => {
        showDialog(DIALOG_TYPE.HELP);
    });

    // settings button
    const settingsEl = document.querySelector(SEL.SETTINGS);
    settingsEl.addEventListener(EVENT.CLICK, (ev) => {
        showDialog(DIALOG_TYPE.SETTINGS);
    });

    // stats button
    const statsEl = document.querySelector(SEL.STATS);
    statsEl.addEventListener(EVENT.CLICK, (ev) => {
        showStatsDialog();
    });

    enableHelpDialogListeners();
    enableSettingsDialogListeners();
    enableStatsDialogListeners();
}

function enableHelpDialogListeners() {
    const dialogEl = document.querySelector(SEL.DIALOG_HELP);

    dialogEl?.addEventListener(EVENT.CANCEL, (ev) => {
        hideDialog(DIALOG_TYPE.HELP);
        updateHelpDialogUI(false, 0);
    });

    dialogEl?.addEventListener(EVENT.CLICK, (ev) => {
        hideDialog(DIALOG_TYPE.HELP);
        updateHelpDialogUI(false, 0);
    });

    var closeEl = dialogEl?.querySelector(SEL.DIALOG_CLOSE);
    closeEl?.addEventListener(EVENT.CLICK, (ev) => {
        hideDialog(DIALOG_TYPE.HELP);
        updateHelpDialogUI(false, 0);
    });

    const helpDialogEl = dialogEl?.querySelector(SEL.DIALOG_CONTAINER);
    helpDialogEl?.addEventListener(EVENT.CLICK, (ev) => {
        ev.stopPropagation();
    });
}

function enableSettingsDialogListeners() {
    const dialogEl = document.querySelector(SEL.DIALOG_SETTINGS);

    dialogEl?.addEventListener(EVENT.CANCEL, (ev) => {
        dialogEl?.classList.remove(CLASS.DIALOG_OPEN);
    });

    dialogEl?.addEventListener(EVENT.CLICK, (ev) => {
        hideDialog(DIALOG_TYPE.SETTINGS);
    });

    var closeEl = dialogEl?.querySelector(SEL.DIALOG_CLOSE);
    closeEl?.addEventListener(EVENT.CLICK, (ev) => {
        hideDialog(DIALOG_TYPE.SETTINGS);
    });

    const settingsDialogEl = dialogEl?.querySelector(SEL.DIALOG_CONTAINER);
    settingsDialogEl?.addEventListener(EVENT.CLICK, (ev) => {
        ev.stopPropagation();
    });

    const darkThemeToggleEl = settingsDialogEl?.querySelector(SEL.TOGGLE_DARK_THEME);
    darkThemeToggleEl?.addEventListener(EVENT.CLICK, handleToggleDarkTheme);

    const hardModeToggleEl = settingsDialogEl?.querySelector(SEL.TOGGLE_HARD_MODE);
    hardModeToggleEl?.addEventListener(EVENT.CLICK, handleToggleHardMode);

    const highContrastToggleEl = settingsDialogEl?.querySelector(SEL.TOGGLE_HIGH_CONTRAST);
    highContrastToggleEl?.addEventListener(EVENT.CLICK, handleToggleHighContrast);
}

function enableStatsDialogListeners() {
    const dialogEl = document.querySelector(SEL.DIALOG_STATS);

    dialogEl?.addEventListener(EVENT.CANCEL, (ev) => {
        dialogEl?.classList.remove(CLASS.DIALOG_OPEN);
    });

    dialogEl?.addEventListener(EVENT.CLICK, (ev) => {
        hideDialog(DIALOG_TYPE.STATS);
    });

    var closeEl = dialogEl?.querySelector(SEL.DIALOG_CLOSE);
    closeEl?.addEventListener(EVENT.CLICK, (ev) => {
        hideDialog(DIALOG_TYPE.STATS);
    });

    const statsDialogEl = dialogEl?.querySelector(SEL.DIALOG_CONTAINER);
    statsDialogEl?.addEventListener(EVENT.CLICK, (ev) => {
        ev.stopPropagation();
    });

    const shareButtonEl = statsDialogEl?.querySelector(SEL.DIALOG_STATS_SHARE_BUTTON);
    shareButtonEl?.addEventListener(EVENT.CLICK, handleShareButtonClick);
}

function enableKeyboardListeners(enable = true) {
    const containerEl = document.querySelector(SEL.CONTAINER);
    const keyboardEls = document.querySelectorAll(SEL.KEYBOARD_ITEM);

    if (enable) {
        containerEl?.addEventListener(EVENT.KEYDOWN, handleKeyDown);

        keyboardEls.forEach((el) => {
            el.addEventListener(EVENT.CLICK, handleKeyboardClick);
        });
    }
    else {
        containerEl?.removeEventListener(EVENT.KEYDOWN, handleKeyDown);

        keyboardEls.forEach((el) => {
            el.removeEventListener(EVENT.CLICK, handleKeyboardClick);
        });
    }
}

function enableCustomListeners(enable = true) {
    const containerEl = document.querySelector(SEL.CONTAINER);
    enable
        ? containerEl?.addEventListener(EVENT.ANIMATION_COMPLETED, handleAnimationCompleted)
        : containerEl?.removeEventListener(EVENT.ANIMATION_COMPLETED, handleAnimationCompleted);
}

function handleKeyDown(ev) {
    if (ev.keyCode >= KEYCODE.LETTER_START && ev.keyCode <= KEYCODE.LETTER_END) {
        handleInput(String.fromCharCode(ev.keyCode));
    }
    else if (ev.keyCode == KEYCODE.ENTER) {
        handleEnter();
    }
    else if (ev.keyCode == KEYCODE.DELETE) {
        handleDelete();
    }
}

function handleKeyboardClick(ev) {
    if (this.className == CLASS.KEYBOARD_ENTER) {
        handleEnter();
    }
    else if (this.className == CLASS.KEYBOARD_DELETE) {
        handleDelete();
    }
    else {
        handleInput(this.innerText);
    }
}

function handleAnimationCompleted(ev) {
    enableKeyboardListeners();
    updateKeyboard();
    checkGame();

    gCurrentRow++;
    gCurrentCol = 0;
}

function handleInput(char) {
    const els = document.querySelectorAll(`.tile-row${gCurrentRow} li`);

    if (gCurrentCol < els.length) {
        let frontEl = els[gCurrentCol]?.querySelector(SEL.FRONT);
        if (frontEl) {
            frontEl.innerHTML = char;
            frontEl.classList.add(CLASS.LETTER);
        }

        let backEl = els[gCurrentCol].querySelector(SEL.BACK);
        if (backEl) {
            backEl.innerHTML = char;
        }

        gCurrentCol++;
    }
}

function handleEnter() {
    const els = document.querySelectorAll(`.tile-row${gCurrentRow} ${SEL.FRONT}`);
    let guess = "";

    els.forEach((el) => {
        guess += el.innerText ?? "";
    });

    if (guess.length < els.length) {
        const msg = messageForToastType(TOAST.NOT_ENOUGH_LETTERS);
        showToast(msg);
        shake();
        return;
    }

    if (!words.includes(guess.toLowerCase())) {
        const msg = messageForToastType(TOAST.NOT_IN_WORD_LIST);
        showToast(msg);
        shake();
        return;
    }

    if (gSettings.hardMode && gCurrentRow > 0) {
        const missingLetter = checkLetterForHardMode(guess);
        if (missingLetter) {
            const msg = `${STR.MISSING_LETTER} ${missingLetter.toUpperCase()}`;
            showToast(msg);
            shake();
            return;
        }
    }

    gDidGuessFirstWord = true;
    enableKeyboardListeners(false);

    // save current guess to session
    gSession.saveGuess(guess);

    // check each letter for correctness and update UI and "share" state
    const checked = checkWord(guess);
    updateUI(checked);
    updateShare(checked);
}

function handleDelete() {
    const els = document.querySelectorAll(`.tile-row${gCurrentRow} li`);
    if (gCurrentCol >= 1) {
        gCurrentCol--;

        const el = els[gCurrentCol];

        const frontEl = el?.querySelector(SEL.FRONT);
        if (frontEl) {
            frontEl.innerHTML = "";
            frontEl.classList.remove(CLASS.LETTER);
        }

        const backEl = el?.querySelector(SEL.BACK);
        if (backEl) {
            backEl.innerHTML = "";
        }
    }
}

function handleToggleDarkTheme(ev) {
    const toggleEl = document.querySelector(SEL.TOGGLE_DARK_THEME);
    const containerEl = document.querySelector(SEL.CONTAINER);

    if (containerEl?.classList.contains(CLASS.DARK)) {
        gSettings.saveSettings({darkTheme: false});
        containerEl?.classList.replace(CLASS.DARK, CLASS.LIGHT);
        toggleEl?.classList.remove(CLASS.ON);
    }
    else {
        gSettings.saveSettings({darkTheme: true});
        containerEl?.classList.replace(CLASS.LIGHT, CLASS.DARK);
        toggleEl?.classList.add(CLASS.ON);
    }
}

function handleToggleHardMode(ev) {
    const toggleEl = document.querySelector(SEL.TOGGLE_HARD_MODE);

    if (gDidGuessFirstWord && toggleEl.classList.contains(CLASS.DISABLED)) {
        showToast(STR.HARD_MODE_HINT);
    }
    else {
        if (toggleEl?.classList.contains(CLASS.ON)) {
            gSettings.saveSettings({hardMode: false});
            toggleEl?.classList.remove(CLASS.ON);

            if (gDidGuessFirstWord) {
                toggleEl?.classList.add(CLASS.DISABLED);
            }
        }
        else {
            gSettings.saveSettings({hardMode: true});
            toggleEl?.classList.add(CLASS.ON);
        }
    }
}

function handleToggleHighContrast(ev) {
    const toggleEl = document.querySelector(SEL.TOGGLE_HIGH_CONTRAST);
    const containerEl = document.querySelector(SEL.CONTAINER);

    if (containerEl?.classList.contains(CLASS.HIGH_CONTRAST)) {
        gSettings.saveSettings({highContrastMode: false});
        containerEl?.classList.remove(CLASS.HIGH_CONTRAST);
        toggleEl?.classList.remove(CLASS.ON);
    }
    else {
        gSettings.saveSettings({highContrastMode: true});
        containerEl?.classList.add(CLASS.HIGH_CONTRAST);
        toggleEl?.classList.add(CLASS.ON);
    }
}

function handleShareButtonClick(ev) {
    // copy results to clipboard
    navigator.clipboard.writeText(gShare);
    showToast(STR.COPIED_RESULTS);
}

function showStatsDialog(didWin = false) {
    updateStatsDialogUI(didWin);
    showDialog(DIALOG_TYPE.STATS);
}

function showDialog(type) {
    let dialogEl;

    switch (type) {
        case DIALOG_TYPE.HELP:
            dialogEl = document.querySelector(SEL.DIALOG_HELP);
            updateHelpDialogUI(true, TIMEOUT.ANIMATION);
            break;

        case DIALOG_TYPE.SETTINGS:
            dialogEl = document.querySelector(SEL.DIALOG_SETTINGS);

            // if game has already started, then disable hard mode toggle
            const toggleHardModeEl = dialogEl?.querySelector(SEL.TOGGLE_HARD_MODE);
            if (toggleHardModeEl &&
                gDidGuessFirstWord &&
                !toggleHardModeEl.classList.contains(CLASS.ON) &&
                !toggleHardModeEl.classList.contains(CLASS.DISABLED))
            {
                toggleHardModeEl.classList.add(CLASS.DISABLED);
            }
            break;

        case DIALOG_TYPE.STATS:
            dialogEl = document.querySelector(SEL.DIALOG_STATS);
            break;
    }

    dialogEl?.showModal();
    dialogEl?.classList.add(CLASS.DIALOG_OPEN);
}

function hideDialog(type) {
    let dialogEl;

    switch (type) {
        case DIALOG_TYPE.HELP:
            dialogEl = document.querySelector(SEL.DIALOG_HELP);
            break;

        case DIALOG_TYPE.SETTINGS:
            dialogEl = document.querySelector(SEL.DIALOG_SETTINGS);
            break;

        case DIALOG_TYPE.STATS:
            dialogEl = document.querySelector(SEL.DIALOG_STATS);
            break;
    }

    dialogEl?.close();
    dialogEl?.classList.remove(CLASS.DIALOG_OPEN);
}

function checkLetterForHardMode(guess) {
    const rowEl = document.querySelector(`.tile-row${gCurrentRow - 1}`);
    const foundEls = rowEl?.querySelectorAll(`${SEL.BACK}:not(${SEL.WRONG})`);

    for (let i = 0; i < foundEls.length; i++) {
        const letter = foundEls[i].innerText;
        if (guess.indexOf(letter) === -1) {
            return letter;
        }
    }

    return null;
}

function checkWord(guess) {
    const guessLC = guess.toLowerCase();
    const guessLen = guessLC.length;

    let check = new Array(guessLen);
    let occur = {};

    // first, check whether all letters are in the right position
    for (let i = 0; i < guessLen; i++) {
        check[i] = guessLC[i] === gWord[i]
            ? LETTER.IS_CORRECT
            : LETTER.IS_WRONG;

        // track the number of times each letter occurs in the word
        occur[gWord[i]] ??= 0;

        // don't count occurrences for letters that are already in the right pos
        if (check[i] != LETTER.IS_CORRECT) {
            occur[gWord[i]] += 1;
        }
    }

    // next check whether letters are found in the word, but in the wrong place
    for (let i = 0; i < guessLen; i++) {
        for (let j = 0; j < guessLen; j++) {

            // skip this letter if we already know its in the right position
            if (check[i] === LETTER.IS_CORRECT) {
                break;
            }

            // otherwise, check if letter is found in word, but not in the right position
            if (guessLC[i] === gWord[j]) {
                if (occur[gWord[j]] > 0) {
                    occur[gWord[j]] -= 1;
                    check[i] = LETTER.IS_FOUND;
                } else {
                    check[i] = LETTER.IS_WRONG;
                }

                break;
            }
        }
    }

    return check;
}

function checkGame() {
    let correctCount = 0;

    const els = document.querySelectorAll(`.tile-row${gCurrentRow} li`);
    els.forEach((el) => {
        const backEl = el.querySelector(SEL.BACK);
        if (backEl?.classList.contains(CLASS.CORRECT)) {
            correctCount++;
        }
    });

    // did user guess the word?
    if (correctCount === els.length) {
        showToast(messageForToastType(TOAST.WIN));
        endGame(true);
    }

    // did user run out of chances?
    else if (gCurrentRow + 1 > els.length) {
        showToast(messageForToastType(TOAST.LOSE), false);
        endGame(false);
    }
}

function updateHelpDialogUI(shouldFlip, timeout) {
    const dialogEl = document.querySelector(SEL.DIALOG_HELP);

    setTimeout(function() {
        const animateEls = dialogEl.querySelectorAll(`${SEL.ANIMATE}`);
        animateEls?.forEach((el) => {
            if (shouldFlip) {
                el.classList.add(CLASS.FLIP);
            } else {
                el.classList.remove(CLASS.FLIP);
            }
        });
    }, timeout);
}

function updateStatsDialogUI(didWin) {
    const statsDialogEl = document.querySelector(SEL.DIALOG_STATS);

    const gamesPlayedEl = statsDialogEl?.querySelector(SEL.DIALOG_GAMES_PLAYED);
    if (gamesPlayedEl) {
        gamesPlayedEl.innerHTML = gStats.gameCount;
    }

    const winPercentageEl = statsDialogEl?.querySelector(SEL.DIALOG_STATS_WIN_PERCENTAGE);
    if (winPercentageEl) {
        winPercentageEl.innerHTML = gStats.winPercentage();
    }

    const winStreakEl = statsDialogEl?.querySelector(SEL.DIALOG_STATS_WIN_STREAK);
    if (winStreakEl) {
        winStreakEl.innerHTML = gStats.winStreak;
    }

    const maxStreakEl = statsDialogEl?.querySelector(SEL.DIALOG_STATS_MAX_STREAK);
    if (maxStreakEl) {
        maxStreakEl.innerHTML = gStats.maxStreak;
    }

    const mostWon = gStats.mostWon();
    for (let i in gStats.guessDist) {
        const guesses = gStats.guessDist[i];
        const barEl = statsDialogEl?.querySelector(`${SEL.DIALOG_STATS_BAR}${i}`);
        if (barEl) {
            barEl.innerHTML = gStats.guessDist[i];
            barEl.style.width = mostWon == 0 || guesses == 0
                ? "0%"
                : Math.round((guesses / mostWon) * 100) + "%";
        }
    }

    // highlight the won guess distribution bar
    if (didWin) {
        const barEl = statsDialogEl?.querySelector(`${SEL.DIALOG_STATS_BAR}${gCurrentRow}`);
        barEl?.classList.add(CLASS.STATS_BAR_WON)
    }
}

function updateSessionUI(guesses) {

    // for each guess
    for (let i = 0; i < guesses.length; i++) {
        let checked = checkWord(guesses[i]);

        // and then for each letter in the guess word
        for (let j = 0; j < guesses[i].length; j++) {
            const els = document.querySelectorAll(`.tile-row${i} li`);

            for (let k = 0; k < els.length; k++) {
                let rowEl = els[k];
                rowEl.classList.add(CLASS.FLIP);

                const frontEl = rowEl.querySelector(SEL.FRONT);
                if (frontEl) {
                    frontEl.classList.add(CLASS.LETTER);
                    frontEl.innerHTML = guesses[i][k];
                }

                const backEl = rowEl.querySelector(SEL.BACK);
                if (backEl) {
                    backEl.innerHTML = guesses[i][k];
                }

                switch (checked[k]) {
                    case LETTER.IS_CORRECT:
                        backEl?.classList?.add(CLASS.CORRECT);
                        break;

                    case LETTER.IS_WRONG:
                        backEl?.classList?.add(CLASS.WRONG);
                        break;

                    case LETTER.IS_FOUND:
                        backEl?.classList?.add(CLASS.FOUND);
                        break;
                }
            }
        }

        gCurrentRow = i;
        updateKeyboard();
        updateShare(checked);
    }

    gCurrentRow = guesses.length;
}

function updateUI(check, animationTimeout = 0) {
    const els = document.querySelectorAll(`.tile-row${gCurrentRow} li`);
    const len = els.length;
    let count = 0;

    for (let i = 0; i < len; i++) {
        let rowEl = els[i];
        if (rowEl.classList.contains(CLASS.FLIP)) {
            count++;
            continue;
        }

        const backEl = rowEl.querySelector(SEL.BACK);
        switch (check[i]) {
            case LETTER.IS_CORRECT:
                backEl?.classList?.add(CLASS.CORRECT);
                break;

            case LETTER.IS_WRONG:
                backEl?.classList?.add(CLASS.WRONG);
                break;

            case LETTER.IS_FOUND:
                backEl?.classList?.add(CLASS.FOUND);
                break;
        }

        setTimeout(function() {
            rowEl.classList.add(CLASS.FLIP);
            updateUI(check, TIMEOUT.ANIMATION);
        }, animationTimeout);

        break;
    }

    if (count === len) {
        setTimeout(function() {
            const containerEl = document.querySelector(SEL.CONTAINER);
            containerEl?.dispatchEvent(animationCompletedEvent);
        }, TIMEOUT.ANIMATION_COMPLETED);
    }
}

function updateShare(check) {
    let hex = "";

    for (let i = 0; i < check.length; i++) {
        switch (check[i]) {
            case LETTER.IS_CORRECT:
                hex = "🟩".codePointAt(0).toString(16);
                break;

            case LETTER.IS_WRONG:
                hex = "⬜".codePointAt(0).toString(16);
                break;

            case LETTER.IS_FOUND:
                hex = "🟨".codePointAt(0).toString(16);
                break;
        }

        gShare += String.fromCodePoint("0x"+hex);
    }

    gShare += "\n";
}

function updateKeyboard() {
    const els = document.querySelectorAll(`.tile-row${gCurrentRow} li`);
    for (let i = 0; i < els.length; i++) {
        const el = els[i].querySelector(SEL.BACK);
        const keyboardEl = el && document.querySelector(`.letter-${el.innerText.toLowerCase()}`);

        keyboardEl?.classList?.remove(CLASS.WRONG);

        // skip if the keyboard key was already used correctly before
        if (keyboardEl?.classList?.contains(CLASS.CORRECT)) {
            continue;
        }

        if (el?.classList?.contains(CLASS.CORRECT)) {
            keyboardEl?.classList?.remove(CLASS.FOUND);
            keyboardEl?.classList?.add(CLASS.CORRECT);
        }
        else if (el?.classList?.contains(CLASS.WRONG)) {
            if (!keyboardEl?.classList.contains(CLASS.FOUND)) {
                keyboardEl?.classList?.add(CLASS.WRONG);
            }
        }
        else if (el?.classList?.contains(CLASS.FOUND)) {
            keyboardEl?.classList?.add(CLASS.FOUND);
        }
    }
}

function hideToast() {
    const toastContainerEl = document.querySelector(SEL.TOAST_CONTAINER);
    if (toastContainerEl) {
        toastContainerEl.classList.replace(CLASS.FADE_IN, CLASS.FADE_OUT);
        gToastFadeOutTimeoutId = setTimeout(function() {
            toastContainerEl.innerHTML = "";
            toastContainerEl.classList.remove(CLASS.FADE_IN, CLASS.FADE_OUT);
        }, TIMEOUT.TOAST_HIDE);
    }
}

function showToast(msg, autoHide = true) {
    if (!msg) {
        return;
    }

    clearTimeout(gToastFadeInTimeoutId);
    clearTimeout(gToastFadeOutTimeoutId);

    const toastContainerEl = document.querySelector(SEL.TOAST_CONTAINER);
    if (toastContainerEl) {
        toastContainerEl.classList.remove(CLASS.FADE_IN, CLASS.FADE_OUT);
        toastContainerEl.innerHTML = msg;
        toastContainerEl.classList.add(CLASS.FADE_IN);

        // auto hide the toast unless we need to stay always stay visible
        if (autoHide) {
            gToastFadeInTimeoutId = setTimeout(function() {
                hideToast();
            }, TIMEOUT.TOAST_SHOW);
        }
    }
}

function messageForToastType(type) {
    switch (type) {
        case TOAST.NOT_ENOUGH_LETTERS:
            return STR.NOT_ENOUGH_LETTERS;

        case TOAST.NOT_IN_WORD_LIST:
            return STR.NOT_IN_WORD_LIST;

        case TOAST.LOSE:
            return gWord.toUpperCase();

        case TOAST.WIN:
            switch (gCurrentRow) {
                case 0:
                case 1:
                    return WIN_MSG[randomIntFromInterval(0,1)];

                default:
                    return WIN_MSG[gCurrentRow];
            }
    }
}

function endGame(didWin) {
    gStats.saveStats(didWin, gCurrentRow + 1);

    if (didWin) {
        bounce(gCurrentRow);
        setTimeout(function() {
            showStatsDialog(didWin);
        }, TIMEOUT.STATS_DIALOG_WIN);
    }
    else {
        setTimeout(function() {
            showStatsDialog(didWin);
        }, TIMEOUT.STATS_DIALOG_LOSE)
    }

    enableKeyboardListeners(false);
    enableCustomListeners(false);

    gSession.clearSession();
}

function bounce(winningRow) {
    const els = document.querySelectorAll(`.tile-row${winningRow} li`);
    let count = 0;

    for (let i = 0; i < els.length; i++) {
        const el = els[i];

        // find the element we haven't bounced yet
        if (el.classList.contains(CLASS.BOUNCE)) {
            count++;
            continue;
        }

        el.classList.add(CLASS.BOUNCE);
        const frontEl = el.querySelector(SEL.FRONT);
        frontEl?.classList.add(CLASS.HIDE);

        const backEl = el.querySelector(SEL.BACK);
        backEl?.classList.add(CLASS.BOUNCE);

        break;
    }

    if (count < els.length) {
        setTimeout(function() {
            bounce(winningRow);
        }, TIMEOUT.BOUNCE);
    }
}

function shake() {
    const row = document.querySelector(`.tile-row${gCurrentRow}`);
    row?.classList?.add(CLASS.SHAKE);

    setTimeout(function() {
        row?.classList?.remove(CLASS.SHAKE);
    }, TIMEOUT.SHAKE);
}

function randomIntFromInterval(min, max) {
    // min and max are included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
