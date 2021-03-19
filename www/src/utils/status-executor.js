/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
