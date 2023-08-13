import {storage} from "@/appwrite";

const getURL = async (image: Image) => {
    return storage.getFilePreview(image.bucketId, image.fileId);
}

export default getURL;