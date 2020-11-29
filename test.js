const order = false;

const breakFastPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (order) {
      resolve('order is ready');
    } else {
      reject(Error('Your order cant be made'));
    }
  }, 3000);
});

console.log(breakFastPromise);

breakFastPromise
  .then((val) => console.log(val))
  .catch((err) => console.log(err));
