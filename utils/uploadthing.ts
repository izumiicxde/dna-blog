import { generateUploadButton } from "@uploadthing/react";
import { genUploader } from "uploadthing/client";
import type { UploadRouter } from "~/routes/api.uploadthing";

export const UploadButton = generateUploadButton<UploadRouter>();

export const { uploadFiles } = genUploader<UploadRouter>();

export const uploadFileToServer = async (file: File) => {
  const response = await uploadFiles("imageUploader", {
    files: [file],
  });
  if (response[0].serverData.url) {
    return response[0].serverData;
  } else {
    return false;
  }
};
