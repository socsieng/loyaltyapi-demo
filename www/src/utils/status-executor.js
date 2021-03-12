import { default as StatusMessage } from '../StatusMessage';

/**
 * Executes a function and returns the result and a status message based on whether or not the function resulted in an error
 *
 * @param {<T>() => Promise<T> | T} fn
 * @param {{success, error}} statusMessageOptions
 * @returns {Promise<[StatusMessage, T | Error]>}
 */
export async function executeWithStatusMessage(fn, { success, error } = {}) {
  try {
    let result = fn();
    if (result.then) {
      result = await result;
    }
    if (success) {
      return [
        <StatusMessage type="info" message={typeof success === 'function' ? success(result) : success} />,
        result,
      ];
    }
    return [undefined, result];
  } catch (err) {
    console.error(err);
    return [
      <StatusMessage
        type="error"
        message={typeof error === 'function' ? error(err) : error || <p>Oops, something went wrong</p>}
      />,
      err,
    ];
  }
}
