import React from 'react'
import file_icon from '../assets/file_icon.png'
import more_vert from '../assets/more_vert.png'
function FileRows({ file }) {
  return (
    <tr>
        <td><img src={file_icon} alt="file_icon" id="file_icon"/></td>
        <td>{file.name}</td>
        <td>{file.storage_path || "Unknown"}</td>
        <td><img src={more_vert} alt="more_vert" id="more_vert"/></td>
    </tr>
  )
}

export default FileRows;