"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInUnion = exports.getProperty = exports.uuid = void 0;
var uuid = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.uuid = uuid;
/**
 * https://mariusschulz.com/blog/keyof-and-lookup-types-in-typescript
 * @param obj
 * @param key
 */
function getProperty(obj, key) {
    return key in obj ? obj : null;
}
exports.getProperty = getProperty;
function isInUnion(key) {
    return key ? key : null;
}
exports.isInUnion = isInUnion;
