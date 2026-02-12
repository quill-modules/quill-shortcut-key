export function throttle(func: (...args: any[]) => any, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  return function (this: any, ...args: any[]) {
    const now = Date.now();
    const remainingTime = wait - (now - lastCallTime);

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCallTime = now;
      func.apply(this, args);
    }
    else if (!timeout) {
      const boundFunc = func.bind(this, ...args);
      timeout = setTimeout(() => {
        lastCallTime = Date.now();
        timeout = null;
        boundFunc();
      }, remainingTime);
    }
  };
}
