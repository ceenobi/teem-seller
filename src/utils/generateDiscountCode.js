function generateDiscountCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 5; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export default generateDiscountCode;
