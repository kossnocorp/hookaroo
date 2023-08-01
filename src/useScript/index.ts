import { useMemo, useState } from "react";

const scriptPromises: { [scriptURL: string]: undefined | Promise<void> } = {};
const scriptResolved: { [scriptURL: string]: undefined | true } = {};

interface UseScriptOptions {
  onLoaded?: () => void;
}

export default function useScript(
  scriptURL: string,
  { onLoaded }: UseScriptOptions = {}
) {
  const promise = scriptPromises[scriptURL];
  const resolved = scriptResolved[scriptURL];
  const [loaded, setLoaded] = useState(!!resolved);

  useMemo(() => {
    if (promise) {
      promise.then(() => setLoaded(true));
    } else {
      scriptPromises[scriptURL] = new Promise((resolve) => {
        const domLoaded = ["complete", "interactive"].includes(
          document.readyState
        );
        const callback = () => {
          const script = document.createElement("script");
          script.src = scriptURL;
          script.onload = () => {
            scriptResolved[scriptURL] = true;
            setLoaded(true);
            resolve();
            onLoaded && onLoaded();
          };
          document.body.appendChild(script);
        };
        if (domLoaded) {
          callback();
        } else {
          document.addEventListener("DOMContentLoaded", callback);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we want it to call just once using the initial values
  }, []);

  return loaded;
}
