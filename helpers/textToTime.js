const textToTime = (text) => {
    // Return null if no text provided
    if (!text) return null;

    // Check if text matches time format HH:mm
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(text)) return null;

    // Split into hours and minutes
    const [hours, minutes] = text.split(':').map(Number);

    // Create and return Date object set to today with provided time
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
};

// FUNCTION TO CONVERT TIME TO TEXT 00:00
const timeToText = (time) => {
    return `${time.getHours()}:${time.getMinutes()}`;
};

export { textToTime, timeToText };
