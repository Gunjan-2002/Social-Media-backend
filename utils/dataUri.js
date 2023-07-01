import DataUriParser  from "datauri/parser.js";
import path from "path";

const getDataUri = (picture) => {
    const parser = new DataUriParser();

    const extName = path.extname(picture.originalname).toString();
    // console.log(extName);
    return parser.format(extName , picture.buffer)
};

export default getDataUri;