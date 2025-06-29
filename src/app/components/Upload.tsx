'use client';
import { Button, Card, Input, List, message, Image, Progress } from 'antd';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react';
import { storage } from '@/firebase/config';

const UploadImageToStorage = () => {
  const [imageFile, setImageFile] = useState<File>();
  const [downloadURL, setDownloadURL] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);

  const handleSelectedFile = (files: File[]) => {
    if (files && files[0].size < 10000000) {
      setImageFile(files[0]);

      console.log(files[0]);
    } else {
      message.error('File size to large');
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      setIsUploading(true);
      const name = imageFile.name;
      const storageRef = ref(storage, `images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress); // to show progress upload

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        error => {
          message.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(url => {
            //url is download url of file
            setDownloadURL(url);
          });
        }
      );
      setIsUploading(false);
    } else {
      message.error('File not found');
    }
  };

  const handleRemoveFile = () => setImageFile(undefined);

  return (
    <div className="container mt-5">
      <div className="col-lg-8 offset-lg-2">
        <Input
          type="file"
          placeholder="Select file to upload"
          onChange={(event: any) => handleSelectedFile(event.target.files)}
        />

        <div className="mt-5">
          <Card>
            {imageFile && (
              <>
                <List.Item
                  extra={[
                    <Button key="btnRemoveFile" onClick={handleRemoveFile}>
                      Remove
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={imageFile.name}
                    description={`Size: ${imageFile.size}`}
                  />
                </List.Item>

                <div className="text-right mt-3">
                  <Button loading={isUploading} onClick={handleUploadFile}>
                    Upload
                  </Button>

                  <Progress percent={progressUpload} />
                </div>
              </>
            )}

            {downloadURL && (
              <>
                <Image
                  src={downloadURL}
                  alt={downloadURL}
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                <p>{downloadURL}</p>
              </>
            )}
            <p></p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadImageToStorage;
