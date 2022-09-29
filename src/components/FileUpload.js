import React, {useState} from 'react';
import {storage, db} from "./firebase.js";
import 'firebase/storage';
import firebase from 'firebase/compat/app';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "./FileUpload.css";

function FileUpload({userName, email}) {
    const [file,setFile] = useState(null);
    const [progress,setProgress]= useState(0);
    const [isUploaded, setIsUploaded] = useState(true);
    const [fileName, setFileName] = useState("");




// Handling File Change
function handleChange(event){
  if(event.target.files[0]){
      setFile(event.target.files[0]);
      console.log(event.target.files[0])
      setFileName(event.target.files[0].name)      
   }
}

// Handling File Uploading
function handleUpload(){
  setIsUploaded(false);
  const storageRef = ref(storage, `files/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
        
  uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
    }, 
  (error) => {
    alert(error.message);
    switch (error.code) {
      case 'storage/unauthorized':
      break;
      case 'storage/canceled':
      break;
      case 'storage/unknown':
      break;
      }
      }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    console.log('File available at', downloadURL);
    db.collection(`${email}/`).add({
    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
    fileUrl:downloadURL,
    userName:userName,
    fileName:fileName
    })
    setProgress(0);
    setFile(null);
    });
    }
  );
setIsUploaded(true);
}

return (
    <div className='fileUpload'>
      <input type="file" onChange={handleChange} />
      <div className='fileUpload__button__align'>
      <button className="fileupload__button" onClick={handleUpload}>{isUploaded?"upload":"uploading"}</button>
      </div>
    </div>
  )
}

export default FileUpload;



