export const loadFromLocalStorage = (key, defaultValue) => {
    if (typeof localStorage === 'undefined') return defaultValue;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error('Error reading from local storage: ', error);
        return defaultValue;
    }

};

export const saveToLocalStorage = (key, value) => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error('Error writing to local storage: ', error);
    }
};