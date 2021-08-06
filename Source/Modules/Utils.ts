import { promisify } from "util";
import glob from "glob";

export const search = promisify(glob);
