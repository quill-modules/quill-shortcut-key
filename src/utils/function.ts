export function throttle(func: (...args: any[]) => any, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: any[] = [];
  let lastThis: any = null;
  let lastCallTime = 0;

  return function (this: any, ...args: any[]) {
    const now = Date.now();
    const remainingTime = wait - (now - lastCallTime);

    lastArgs = args;
    lastThis = this;

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCallTime = now;
      func.apply(lastThis, lastArgs);
    }
    else if (!timeout) {
      timeout = setTimeout(() => {
        lastCallTime = Date.now();
        timeout = null;
        func.apply(lastThis, lastArgs);
      }, remainingTime);
    }
  };
}
