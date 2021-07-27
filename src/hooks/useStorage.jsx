import React, { Component, useEffect, useState } from "react";
import {
  projectFirestore,
  projectStorage,
  timeStamp,
} from "../firebase/config";

const useStorage = (file) => {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storageRef = projectStorage.ref(file.name);
    const collectionRef = projectFirestore.collection("images");

    storageRef.put(file).on("state_changed", (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      setProgress(percentage);
      console.log(percentage);
    },
      (err) => {
        setError(err);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
        const createdAt = timeStamp();
        collectionRef.add({ url: url, createdAt });
        setUrl(url);
      });
  }, [file]);
  return { progress, url, error };
};

export default useStorage;
