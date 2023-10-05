import moment from "moment";

export const formatDate = (date: string) => moment(date).fromNow();
export const sortFun = function(a:BoardProps, b:BoardProps){
  if(a.name < b.name) { return -1; }
  if(a.name > b.name) { return 1; }
  return 0;
}

import { generateComponents } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();


  
