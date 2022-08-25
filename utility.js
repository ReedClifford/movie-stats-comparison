const debounce = (callback, delay) => {
  let timeOutId;
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};
