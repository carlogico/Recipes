function storeAndParseOriginal(section, match, parseFunction) {
    if (!section.dataset.original) {
        section.dataset.original = parseFunction(match); // Store the original value
    }
    return section.dataset.original
}
function multiplyAndFormatResult(val, multiplier) {
    const result = val * multiplier;
    return Number.isInteger(result) ? result : result.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    const multiplyButton = document.getElementById('multiply-btn');
    const resetButton = document.getElementById('reset-btn');

    multiplyButton.addEventListener('click', () => {
        const multiplier = parseFloat(document.getElementById('multiplier').value);
        if (isNaN(multiplier)) {
            alert('Please enter a valid multiplier');
            return;
        }

        const amounts = document.querySelectorAll('.amnt'); // Select all elements with the class 'amnt'
        amounts.forEach((section) => {
            let text = section.innerHTML;
            if (!section.dataset.originalText) {
                section.dataset.originalText = text; // Store the original text
            }
            // Handle mixed fractions
            if (/\b\d+\s+\d+\/\d+/.test(text)) {
                text = text.replace(/\b(\d+)\s+(\d+)\/(\d+)/g, (_, whole, num, den) => {
                    const result = storeAndParseOriginal(section, {whole, num, den}, (val) => parseFloat(val.whole) + val.num / val.den);
                    return multiplyAndFormatResult(result, multiplier);
                });
            }
            // Handle fractions
            else if (/\b\d+\/\d+/.test(text)) {
                text = text.replace(/\b(\d+)\/(\d+)/g, (_, num, den) => {
                    const result = storeAndParseOriginal(section, {num, den}, (val) => val.num / val.den);
                    return multiplyAndFormatResult(result, multiplier);
                });
            }
            // Handle whole numbers and decimals
            else if (/\b\d+(\.\d+)?/.test(text)) {
                text = text.replace(/\b\d+(\.\d+)?/g, (match) => {
                    const result = storeAndParseOriginal(section, match, (val) => parseFloat(val));
                    return multiplyAndFormatResult(result, multiplier)
                });
            }
            // Update the HTML with the modified text
            section.innerHTML = text;
        });
    });

    resetButton.addEventListener('click', () => {
        const amounts = document.querySelectorAll('.amnt'); // Select all elements with the class 'amnt'
        amounts.forEach((section) => {
            if (section.dataset.originalText) {
                section.innerHTML = section.dataset.originalText;
                return section.dataset.original;
            }
        });
    });
});