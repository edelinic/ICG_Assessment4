export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomWeighted(results, weights) {
    var num = Math.random(),
        s = 0,
        lastIndex = weights.length - 1;

    for (var i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
            return results[i];
        }
    }

    return results[lastIndex];
};
