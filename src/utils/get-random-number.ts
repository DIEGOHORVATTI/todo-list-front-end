export const getRandomNumber = (start: number, end: number) => {
  return (Math.floor(new Date().getTime() * Math.random()) % (end - start + 1)) + start
}
