/**
 * @file app.js
 * @description This JavaScript file is responsible for fetching and displaying mold level data from the PollenSense API.
 * It uses a gauge to display the current mold level and provides a list of hourly mold levels with corresponding times.
 * The data is fetched dynamically based on either the current date or a date passed via the URL as a query parameter.
 *
 * Features:
 * - Fetches hourly mold level data from the PollenSense API.
 * - Displays mold levels in a gauge with zones for low, medium, and high levels.
 * - Lists the hourly mold levels with timestamps.
 * - Provides easy-to-edit global variables for API URLs, API keys, timezones, and other configuration values.
 *
 * Author: Earl Vhin Gabuat
 *
 * @version 1.0.0
 * @since 2024-09-12
 */

/**
 * Configuration object for API details and other global variables.
 */
const config = {
    apiUrl: 'https://sensors.pollensense.com/api/sites/379ec159-ac99-43bf-9d2d-a2371638b942/metrics',
    apiKey: 'm0sncI7JMb8jLj4prR6ZojN08wadP2sxAV4ZIx9DCyKJhxtf6HjEARwOqZkhh1MSBXAfzXSW9oarlh84Ao9sCye',
    defaultInterval: 'hour', // Can be changed to 'day', 'week', etc.
    timezone: 'America/New_York', // Default timezone
};

/**
 * Retrieves a URL query parameter value by name.
 * @param {string} name - The name of the query parameter.
 * @returns {string | null} The value of the query parameter or null if not found.
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Converts a date to US Eastern Time and formats it in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date in ISO 8601 format.
 */
function getFormattedDate(date) {
    const easternTime = new Date(date.toLocaleString('en-US', { timeZone: config.timezone }));
    return easternTime.toISOString().split('.')[0] + 'Z';
}

/**
 * Converts a date to US Eastern Time and formats it in a human-readable format (e.g., September 12, 2024).
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date in "Month Day, Year" format.
 */
function getHumanReadableDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const easternTime = new Date(date.toLocaleString('en-US', { timeZone: config.timezone }));
    return easternTime.toLocaleDateString('en-US', options);
}

/**
 * Fetches mold data from the PollenSense API.
 * @returns {Promise<Object>} A promise that resolves to an object containing moments, PPM3 data, and Misery data.
 */
async function getMoldData() {
    const urlDate = getUrlParameter('date');
    let startingDate, endingDate;

    if (urlDate) {
        startingDate = new Date(`${urlDate}T00:00:00`);
        endingDate = new Date(`${urlDate}T23:59:59`);
    } else {
        const today = new Date();
        startingDate = new Date(today.setHours(0, 0, 0, 0));
        endingDate = new Date();
    }

    const formattedStartingDate = getFormattedDate(startingDate);
    const formattedEndingDate = getFormattedDate(endingDate);

    // Update the date display to use human-readable format
    document.getElementById('dateDisplay').textContent = getHumanReadableDate(startingDate);

    const response = await fetch(
        `${config.apiUrl}?interval=${config.defaultInterval}&starting=${formattedStartingDate}&ending=${formattedEndingDate}`,
        {
            headers: {
                'X-Ps-Key': config.apiKey,
            },
        },
    );

    const data = await response.json();
    const moldCategory = data.Categories.find((category) => category.CategoryCode === 'MOL');
    return {
        moments: data.Moments,
        PPM3: moldCategory.PPM3,
        Misery: moldCategory.Misery || [], // Misery index values if available
    };
}

/**
 * Dynamically creates and displays gauges based on the given misery values, normalized to a 0-100% scale.
 * Adds the hour above the gauge and PPM value below the gauge.
 * @param {Array<number>} lastFourPPM - The last 2 to 4 raw mold PPM values.
 * @param {Array<string>} moments - Corresponding times for the PPM values.
 * @param {Array<number>} miseryValues - Corresponding misery index values (0-100 scale).
 */
function displayGauges(lastFourPPM, moments, miseryValues) {
    const gaugeContainer = document.getElementById('gaugeContainer');
    gaugeContainer.innerHTML = ''; // Clear any existing gauges

    lastFourPPM.forEach((ppm, index) => {
        const miseryValue = miseryValues[index] ? (miseryValues[index] * 100).toFixed(2) : 'N/A';

        // Create a container div for each gauge (with hour and PPM labels)
        const canvasContainer = document.createElement('div');
        canvasContainer.classList.add('canvas-container');

        // Create the hour label above the gauge
        const timeLabel = document.createElement('div');
        timeLabel.classList.add('gauge-time-label');
        const time = new Date(moments[index]).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        timeLabel.textContent = `Time: ${time}`;

        // Create canvas element for the gauge
        const canvas = document.createElement('canvas');
        canvas.id = `gaugeCanvas${index + 1}`;
        canvas.width = 300;
        canvas.height = 180;

        // Create the PPM label below the gauge
        const ppmLabel = document.createElement('div');
        ppmLabel.classList.add('gauge-ppm-label');
        ppmLabel.textContent = `PPM: ${ppm.toFixed(2)} | Misery: ${miseryValue}%`;

        // Append time, canvas, and PPM label to the container div
        canvasContainer.appendChild(timeLabel);
        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(ppmLabel);

        // Append the container div to the gaugeContainer
        gaugeContainer.appendChild(canvasContainer);

        // Create the gauge for each value
        const opts = {
            angle: 0.15,
            lineWidth: 0.44,
            radiusScale: 1,
            pointer: {
                length: 0.8,
                strokeWidth: 0.035,
                color: '#000000',
            },
            limitMax: true,
            limitMin: true,
            highDpiSupport: true,
            staticZones: [
                { strokeStyle: '#30B32D', min: 0, max: 24 }, // Low (0-24%)
                { strokeStyle: '#FFDD00', min: 25, max: 49 }, // Moderate (25-49%)
                { strokeStyle: '#F39C12', min: 50, max: 74 }, // High (50-74%)
                { strokeStyle: '#E74C3C', min: 75, max: 100 }, // Very High (75-100%)
            ],
            staticLabels: {
                font: '12px sans-serif',
                labels: [0, 25, 50, 75, 100],
                color: '#000000',
                fractionDigits: 0,
            },
            renderTicks: {
                divisions: 4,
                divWidth: 1.1,
                divLength: 0.7,
                divColor: '#333333',
                subDivisions: 3,
                subLength: 0.5,
                subWidth: 0.6,
                subColor: '#666666',
            },
        };

        const gauge = new Gauge(canvas).setOptions(opts);
        gauge.maxValue = 100; // 100% is the max value for the gauge
        gauge.setMinValue(0); // Start at 0
        gauge.animationSpeed = 32;
        gauge.set(miseryValues[index] * 100); // Set the Misery value as the gauge input
    });
}

/**
 * Displays the mold data with time labels.
 * @param {Array<string>} moments - Array of time moments.
 * @param {Array<number>} PPM3 - Array of mold PPM3 values corresponding to the moments.
 */
function displayMoldData(moments, PPM3) {
    const moldDataContainer = document.getElementById('moldDataContainer');
    moldDataContainer.innerHTML = ''; // Clear any previous content

    moments.forEach((moment, index) => {
        const ppmValue = PPM3[index];
        if (ppmValue !== null) {
            const time = new Date(moment).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            const recordItem = document.createElement('div');
            recordItem.className = 'record-item';

            const recordTime = document.createElement('div');
            recordTime.className = 'record-time';
            recordTime.textContent = time;

            const recordPPM = document.createElement('div');
            recordPPM.className = 'record-ppm';
            recordPPM.textContent = `${ppmValue.toFixed(2)} PPM`;

            recordItem.appendChild(recordTime);
            recordItem.appendChild(recordPPM);

            moldDataContainer.appendChild(recordItem);
        }
    });
}

/**
 * Initializes the page by fetching the mold data and displaying the available values (up to 4).
 */
async function init() {
    const { moments, PPM3, Misery } = await getMoldData();

    const validPPM = PPM3.filter((ppm) => ppm !== null);
    const validMoments = moments.filter((_, index) => PPM3[index] !== null);
    const validMisery = Misery.filter((misery) => misery !== null);

    const lastFourPPM = validPPM.slice(-4);
    const lastFourMoments = validMoments.slice(-4);
    const lastFourMisery = validMisery.slice(-4);

    displayGauges(lastFourPPM, lastFourMoments, lastFourMisery);
    // displayMoldData(moments, PPM3);
}

// Initialize the page when loaded
window.onload = init;
