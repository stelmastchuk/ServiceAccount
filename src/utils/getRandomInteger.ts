export const getRandomIntegerInclusive = (min, max): number => {
    const number = Math.floor(Math.random() * (max - min + 1)) + min
    return number
}