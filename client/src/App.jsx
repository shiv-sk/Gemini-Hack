import { useState } from 'react'
import './App.css'
import MarkedTex from './MarkedText';

function App() {
  const [markedText , setMarkedText] = useState("");
  const [sendData , setSendData] = useState({
    prompt:"",
    Images:[]
  })
  console.log("sendData is! " , sendData);
  const handleFileChange = (e)=>{
    const files = Array.from(e.target.files);
    setSendData({...sendData , Images:files});
  }

  const handleButton = async ()=>{
    const formData = new FormData();
    formData.append("prompt" , sendData.prompt);
    sendData.Images.map((file)=>(
      formData.append("Images" , file)
    ))

    const requestOptions = {
      method:"POST",
      body:formData
    }
    console.log("the form data is! " , formData);
    try {
      const response = await fetch("http://localhost:3000/upload/generateContent" , requestOptions);
      const data = await response.json();
      setMarkedText(data?.content);
      // console.log("the response is! " , data.content);
    } catch (error) {
      console.log("the error is! " , error);
    }
  }

  return (
    <>
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <input type="text" 
      value={sendData.prompt} 
      onChange={(e)=>setSendData({...sendData , prompt:e.target.value})}
      style={{ display: "block", marginBottom: "1rem", width: "100%" }}
      placeholder='enter your prompt here'
      />
      <input type="file" multiple 
      onChange={handleFileChange}
      style={{ display: "block", marginBottom: "1rem" }}
      />
      <button onClick={handleButton}>sendData</button>
    </div>
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <textarea value={markedText} onChange={(e)=>setMarkedText(e.target.value)}></textarea>
      <MarkedTex markdownText={markedText}/>
    </div>
    
    </>
  )
}

export default App
