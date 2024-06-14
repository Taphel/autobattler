const formatNumberString = (number, displayTenth = true) => {
    if (Math.log10(number) >= 12) {
        if (Math.log10(number) >= 14) {
            return `${Math.floor(number/1e12).toLocaleString("en")}T`;
        } else {
            return `${(number/1e12).toFixed(1).toLocaleString("en")}T`;
        }   
    }

    if (Math.log10(number) >= 9) {
        if (Math.log10(number) >= 11) {
            return `${Math.floor(number/1e9).toLocaleString("en")}B`;
        } else {
            return `${(number/1e9).toFixed(1).toLocaleString("en")}B`;
        }  
    }

    if (Math.log10(number) >= 6) {
        if (Math.log10(number) >= 8) {
            return `${Math.floor(number/1e6).toLocaleString("en")}M`;
        } else {
            return `${(number/1e6).toFixed(1).toLocaleString("en")}M`;
        }  
    }

    if (Math.log10(number) >= 3) {
        if (Math.log10(number) >= 5) {
            return `${Math.floor(number/1e3).toLocaleString("en")}K`;
        } else {
            return `${(number/1e3).toFixed(1).toLocaleString("en")}K`;
        }
    }

    if (Math.log10(number) < 2 && displayTenth) {
        return `${(number).toFixed(1).toLocaleString("en")}`;
    } else {
        return `${Math.floor(number).toLocaleString("en")}`;
    }
    
    return Math.floor(number).toLocaleString("en");
}

export default formatNumberString;