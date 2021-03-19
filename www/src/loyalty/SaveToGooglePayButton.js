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

import { useEffect, useRef } from 'react';
import { loadScript } from '../utils/load-script';
import './Loyalty.css';

function SaveToGooglePayButton({ jwt }) {
  const divRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (divRef.current) {
        const button = document.createElement('g:savetoandroidpay');
        button.setAttribute('jwt', jwt);
        button.setAttribute('size', 'large');
        button.setAttribute('theme', 'light');

        divRef.current.appendChild(button);

        await loadScript('https://apis.google.com/js/platform.js');
      }
    })();
  }, [jwt]);

  return <div ref={divRef} />;
}

export default SaveToGooglePayButton;
