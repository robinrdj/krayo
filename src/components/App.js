import React,{useEffect, useState} from 'react';
import firebase from 'firebase/compat/app';
import {db,auth} from "./firebase.js";
import FileUpload from "./FileUpload";
import File from "./File.js";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';

import "./App.css";


function App() {
  const [files,setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [user,setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  // fetching files
  useEffect(()=>{
    db.collection(`${userEmail}`).orderBy("timestamp","desc").onSnapshot(snapshot=>{
      setFiles(snapshot.docs.map(doc=>({
      id:doc.id,
      post:doc.data()
      })
      ));
    })
  },[files, userEmail]);


  // Authentication Updation
  useEffect(()=>{
  const unsubscribe = auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      console.log(authUser);
      setUser(authUser);
      console.log(user);
      setUserEmail(authUser.email);
    }else{
      setUser(null);
    }
   })
   return()=>{
    unsubscribe();
   }
  },[user,userName])


// Sign Up
function handleSubmit(event){
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      setOpen(false); 
      setPassword("");
      setEmail("");
     return  authUser.user.updateProfile({
        displayName:userName
      })
    })
    .catch((error)=>alert(error.message))
    setUserName("");
  }
  
  // Sign IN
function handleSignInSubmit(event){
  event.preventDefault();
  auth.signInWithEmailAndPassword(email,password)
  .catch((error)=>alert(error.message));
  setOpenSignIn(false);
   setUserName("");
   setPassword("");
}

// Sign In With Google
function signInWithGoogle(){
     var googleProvider = new firebase.auth.GoogleAuthProvider();
     auth.signInWithPopup(googleProvider)
     .then((result)=>{
        console.log(result);
     })
     .catch((error)=>{
      console.log(error);
     })
}

return (
  <div className='app'>
    <Modal
        open={open}
        onClose={()=>{
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box className="sign__box" sx={style}>
         <div className='image__align'>
         <img className = "app__header__image" src="https://www.krayo.io/images/Krayo_logo.png" alt="Krayo_Image" />
         </div>
         <form onSubmit={handleSubmit}>
         <div className="app__signup">
         <Input placeholder="userName" type="text" value={userName} onChange={(e)=> setUserName(e.target.value)} />
         <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)} />
         <Input placeholder="password" type="text" value={password} onChange={(e)=> setPassword(e.target.value)} />
         <button className="sign__button" type="submit">Sign Up</button>
         </div>
         </form>
         </Box>
    </Modal>
    <Modal
        open={openSignIn}
        onClose={()=>{
          setOpenSignIn(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box  className="sign__box" sx={style}>
         <div className='image__align'>
         <img className = "app__header__image__second" src="https://www.krayo.io/images/Krayo_logo.png" alt="Krayo_Image" />
         </div>
         <form onSubmit={handleSignInSubmit}>
         <div className="app__signup">
         <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)} />
         <Input placeholder="password" type="text" value={password} onChange={(e)=> setPassword(e.target.value)} />
         <button className="sign__button" type="submit">Sign In</button>
         </div>
         </form>
         </Box>
    </Modal>
      

    <div className="app__Header">
        <img className = "app__header__image" src="https://www.krayo.io/images/Krayo_logo.png" alt="Krayo_Image" />
        <div>
        {user?(<Button onClick={()=>{auth.signOut()}}>Log Out</Button>):(<Button onClick={()=>{setOpen(true);}}>Sign Up</Button>)}
        <Button onClick={()=>{setOpenSignIn(true);}}>Sign In</Button>
        <Button onClick={signInWithGoogle}>Sign In With Google</Button>
        </div>
        </div>
        {user?.displayName?( <FileUpload userName={user.displayName} email={userEmail}/>):<div className='sorry__message__container'><h3 className='sorry__message'>Sorry, U have to login to upload.</h3></div>}
        {user?.displayName? <div className="app__posts">
        {
         files.map(({id,post})=>(
        <File  key={id} fileId={id} user={user} userName={post.userName}  fileUrl ={post.fileUrl} fileName={post.fileName} timeStamp={post.timestamp}/>
        ))
        }
       </div>:""}
       
  </div>
)
}

export default App;