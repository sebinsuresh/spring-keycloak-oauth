class URLFormatter {
    static truncateMiddle(paramValue, maxLen = 80) {
        if (paramValue.length <= maxLen) {
            return paramValue;
        }

        const half = Math.floor((maxLen - 1) / 2);

        return paramValue.slice(0, half) +
            '…' +
            paramValue.slice(-half);
    }

    static truncateUrl(url, paramsToTruncate) {
        // Only handle specific query params with middle-truncation
        // Keep the full path and other query params intact
        let result = url;

        for (const param of paramsToTruncate) {
            // TODO: Better parsing of query params
            const regex = new RegExp(`([?&]${param}=)([^&]+)`, 'g');

            result = result.replace(regex, (match, prefix, value) => {
                return prefix + this.truncateMiddle(value);
            });
        }

        return result;
    }

    static wrapText(text, lineLen = 80) {
        if (text.length <= lineLen) {
            return text;
        }
        const lines = [];
        for (let i = 0; i < text.length; i += lineLen) {
            lines.push(text.slice(i, i + lineLen));
        }
        return lines.join('<br>');
    }

    static shrinkUrl(url, paramsToTruncate) {
        const truncated = this.truncateUrl(url, paramsToTruncate);
        return this.wrapText(truncated);
    }
}
