import React from 'react';
import Avatar from '@mui/material/Avatar';

import "./File.css";

function File({fileId,fileUrl,userName, fileName}) {
  return (
    <div className="file">
     <div className='file__header'>
     <Avatar className="file__avatar" alt={userName} src="ergreaj"/>
     <h3>{userName}</h3>
     </div>
     <a href={fileUrl} className="file__link" target="blank">{fileName}</a>
    </div>
  )
}

export default File;