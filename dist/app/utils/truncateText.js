"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateText = void 0;
const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};
exports.truncateText = truncateText;
