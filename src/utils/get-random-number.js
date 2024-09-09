export const getRandomNumber = (start, end) => {
  return (Math.floor(new Date().getTime() * Math.random()) % (end - start + 1)) + start
}
