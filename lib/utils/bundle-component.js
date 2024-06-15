import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url)),
  bundleComponent = (a, b) => {
    const c = path.join(__dirname, `../components/${b}`);
    return a.add(b, c);
  };
export default bundleComponent;
