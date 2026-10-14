type MyFunction = () => Promise<void>;

export function HandleError(callback: MyFunction) {
  try {
    callback();
  } catch (err) {
    console.error(err);
  }
}
