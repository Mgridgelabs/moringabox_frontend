import React from 'react'
import file_icon from '../assets/file_icon.png'
import more_vert from '../assets/more_vert.png'
function FileRows() {
  return (
    <tr>
        <td><img src={file_icon} alt="file_icon" id="file_icon"/></td>
        <td>Doc1</td>
        <td>Google Docs</td>
        <td><img src={more_vert} alt="more_vert" id="more_vert"/></td>
    </tr>
  )
}

export default FileRows