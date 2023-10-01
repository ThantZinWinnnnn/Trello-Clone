"use client"
import React from 'react'
import { CldUploadWidget } from 'next-cloudinary';

const UploadImageBtn = () => {
  return (
    <CldUploadWidget uploadPreset="<Upload Preset>">
  {({ open }) => {
    function handleOnClick(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.preventDefault();
      open();
    }
    return (
      <button className="button" onClick={handleOnClick}>
        Upload an Image
      </button>
    );
  }}
</CldUploadWidget>
  )
}

export default UploadImageBtn