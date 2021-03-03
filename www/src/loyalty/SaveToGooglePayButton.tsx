import { useEffect, useRef } from 'react';
import { loadScript } from '../utils/load-script';
import './Loyalty.css';

interface Props {
  jwt: string;
}

function SaveToGooglePayButton({ jwt }: Props) {
  const divRef = useRef<HTMLDivElement>(null);

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
