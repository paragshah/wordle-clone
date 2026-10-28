class WordleSettings {
    hardMode = false;
    darkTheme = false;
    highContrastMode = false;
    #localStorageName = "settings";

    constructor() {
        this.loadSettings();
    }

    loadSettings() {
        let settingsStr = localStorage.getItem(this.#localStorageName);
        if (settingsStr && settingsStr.length) {
            try {
                const settings = JSON.parse(settingsStr);
                this.hardMode = settings.hard_mode;
                this.darkTheme = settings.dark_theme;
                this.highContrastMode = settings.high_contrast_mode;
            }
            catch (err) {
                console.error("Unable to fetch settings from local storage:\n" + err);
            }
        }
    }

    saveSettings(settings) {
        let settingsMap = {
            hard_mode: settings.hardMode ?? this.hardMode,
            dark_theme: settings.darkTheme ?? this.darkTheme,
            high_contrast_mode: settings.highContrastMode ?? this.highContrastMode
        };

        try {
            localStorage.setItem(this.#localStorageName, JSON.stringify(settingsMap));
            this.loadSettings();
        }
        catch (err) {
            console.error("Unable to save settings to local storage:\n" + err);
        }
    }
}