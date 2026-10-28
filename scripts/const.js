const CLASS = {
    BOUNCE: "bounce",
    CORRECT: "correct",
    DARK: "dark",
    DIALOG_OPEN: "dialog-open",
    DISABLED: "disabled",
    FADE_IN: "fade-in",
    FADE_OUT: "fade-out",
    FLIP: "flip",
    FOUND: "found",
    HIDE: "hide",
    HIGH_CONTRAST: "high-contrast",
    KEYBOARD_DELETE: "keyboard-delete",
    KEYBOARD_ENTER: "keyboard-enter",
    LETTER: "letter",
    LIGHT: "light",
    ON: "on",
    SHAKE: "shake",
    STATS_BAR_WON: "stats-bar-won",
    WRONG: "wrong"
};

const DIALOG_TYPE = {
    HELP: 0,
    SETTINGS: 1,
    STATS: 2
};

const EVENT = {
    ANIMATION_COMPLETED: "animationCompleted",
    CANCEL: "cancel",
    CLICK: "click",
    KEYDOWN: "keydown"
};

const KEYCODE = {
    DELETE: 8,
    ENTER: 13,
    LETTER_START: 65,
    LETTER_END: 90
};

const LETTER = {
    IS_CORRECT: 0,
    IS_WRONG: 1,
    IS_FOUND: 2
};

const SEL = {
    ANIMATE: ".animate",
    BACK: ".back",
    CONTAINER: ".container",
    DIALOG: ".dialog",
    DIALOG_CLOSE: ".dialog-close",
    DIALOG_CONTAINER: ".dialog-container",
    DIALOG_HELP: ".dialog-help",
    DIALOG_SETTINGS: ".dialog-settings",
    DIALOG_GAMES_PLAYED: ".games-played",
    DIALOG_STATS: ".dialog-stats",
    DIALOG_STATS_BAR: ".stats-bar-",
    DIALOG_STATS_SHARE_BUTTON: ".share-button",
    DIALOG_STATS_MAX_STREAK: ".max-streak",
    DIALOG_STATS_WIN_PERCENTAGE: ".win-percentage",
    DIALOG_STATS_WIN_STREAK: ".win-streak",
    FRONT: ".front",
    HELP: ".help",
    KEYBOARD_ITEM: ".keyboard-container li",
    SETTINGS: ".settings",
    STATS: ".stats",
    TITLE_CONTAINER: ".title-container",
    TOAST: ".toast",
    TOAST_CONTAINER: ".toast-container",
    TOGGLE_DARK_THEME: ".toggle-dark-theme",
    TOGGLE_HARD_MODE: ".toggle-hard-mode",
    TOGGLE_HIGH_CONTRAST: ".toggle-high-contrast",
    WRONG: ".wrong"
};

const STR = {
    COPIED_RESULTS: "Copied results to clipboard",
    GENIUS: "Genius",
    GREAT: "Great",
    HARD_MODE_HINT: "Hard mode can only be enabled at the start of a round",
    IMPRESSIVE: "Impressive",
    MAGNIFICENT: "Magnificent",
    MISSING_LETTER: "Guess must contain",
    NOT_ENOUGH_LETTERS: "Not enough letters",
    NOT_IN_WORD_LIST: "Not in word list",
    PHEW: "Phew",
    SPLENDID: "Splendid"
};

const TIMEOUT = {
    ANIMATION: 300,
    ANIMATION_COMPLETED: 320,
    DIALOG_FADE_OUT: 200,
    BOUNCE: 130,
    SHAKE: 370,
    STATS_DIALOG_LOSE: 1000,
    STATS_DIALOG_WIN: 1560,
    TOAST_HIDE: 1000,
    TOAST_SHOW: 1600
};

const TOAST = {
    NOT_ENOUGH_LETTERS: 0,
    NOT_IN_WORD_LIST: 1,
    LOSE: 2,
    WIN: 3
};

// order matters
const WIN_MSG = [
    STR.GENIUS,
    STR.MAGNIFICENT,
    STR.IMPRESSIVE,
    STR.SPLENDID,
    STR.GREAT,
    STR.PHEW
];
