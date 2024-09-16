export const gaugeOptions = {
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
