const formatNumberString = (number, roundingMethod) => {
    if (Math.log10(number) >= 12) {
        return `${(Math[roundingMethod](number / 1e11) / 10).toFixed(1).toLocaleString("en")}T`;
    }

    if (Math.log10(number) >= 9) {
        return `${(Math[roundingMethod](number / 1e8) / 10).toFixed(1).toLocaleString("en")}B`;
    }

    if (Math.log10(number) >= 6) {
        return `${(Math[roundingMethod](number / 1e5) / 10).toFixed(1).toLocaleString("en")}M`;
    }

    if (Math.log10(number) >= 4) {
        return `${(Math[roundingMethod](number / 1e2) / 10).toFixed(1).toLocaleString("en")}K`;
    }

    return Math[roundingMethod](number).toLocaleString("en");
}

export default formatNumberString;