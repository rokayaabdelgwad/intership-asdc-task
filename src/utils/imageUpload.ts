import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const generateFilename = (fieldname: string): string => {
    const filename: string = path.parse(fieldname).name.replace(/\s/g, '') + uuidv4();
    const extension: string = path.parse(fieldname).ext;
    return `${filename}${extension}`;
};

