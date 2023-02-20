import React, {  useEffect, useState, useRef } from "react";
import "./App.css";
import randomWords from "random-words";
import useSound from 'use-sound';
import corr from './assets/sounds/correct.mp3';
import wrong  from './assets/sounds/wrong.mp3';
// import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
const size = 200;
const seconds = 30;

const App = () => {
  const [words, setwords] = useState([]);
  const [data, setdata] = useState("");
  const [timer, settimer] = useState(seconds);
  const [currwordindex,setcurrwordindex]=useState(0);
  const [currcharindex,setcurrcharindex]=useState(-1);
  const [currchar,setcurrchar]=useState("");
  const [correct,setcorrect]=useState(0);
  const [incorrect,setincorrect]=useState(0);
  const [status,setstatus]=useState("waiting");
  const textInput=useRef(null);
  const [cplay] = useSound(corr,{volume:0.5});
  const [wplay] = useSound(wrong);
  var accuracy=Math.round(correct/(correct+incorrect)*100).toFixed(2);
  useEffect(() => {
    setwords(generatWords());
    
  },[]);

  useEffect(()=>{
    if(status==='started')
    {
      textInput.current.focus();
      settimer(seconds);
      let interval=setInterval(()=>{
        settimer((prevtimer)=>{
          if(prevtimer===0)
          {
            clearInterval(interval);
            setstatus("finished");
            return seconds;
          }
          else
          return prevtimer-1;
        })
      },1000)
    }

  },[status])



  function generatWords() {
    return new Array(size).fill(null).map(() => randomWords());
  }
  const start=()=>{
    if(status==="finished")
    {
      setcurrwordindex(0);
      setwords(generatWords());
      setcorrect(0);
      setincorrect(0);
      setdata("");
      
    }
    if(status!=="started")
    {
      setstatus("started");
    }
    if(status==="started")
    {
      setstatus("finished");
      changeall();
    }
  }
  const handlekeydown=({keyCode,key})=>{

    if(keyCode===32){
      checkMatch();
      setdata("");
      setcurrwordindex(currwordindex+1);
      setcurrcharindex(-1);
    }
    else if (keyCode===8)
    {
      setcurrcharindex(currcharindex-1);
      setcurrchar("");
    }
    else{
      setcurrcharindex(currcharindex+1);
      setcurrchar(key);
    }
  }
  const checkMatch=()=>{
    const wordToCompare=words[currwordindex];
    const ans=wordToCompare===data.trim();
    if(ans)
    {
      
      setcorrect(correct+1);
    }
    else
    {
     
      setincorrect(incorrect+1);
    }
    console.log(ans);
  }
  const getcharclass=(wordidx,charidx,char)=>{
    if(wordidx===currwordindex && charidx===currcharindex && currchar && status!=="finished")
    {
      if(char===currchar)
      {
        cplay();
        return "sucess"
        
      }
      else
      {
        wplay();
        return "danger"
      }
    }
    else if(wordidx===currwordindex && currcharindex>=words[currwordindex].length)
    {
      return "danger";
    } 
    else
    {
      return "underscore";
    }
  }
  const changeall = () => {
    start();
  };
  return (
    <div className="main">
      <div className="top">
        <div className="timer">
        {status==="started" &&<label>{timer}</label>}
        {status==="waiting" && <div className="container"><h3 className="type-effect">Test your typing skills now!</h3></div>
          }
          {status==="finished"&& <label className="timer" >Result</label>}
        </div>

        {status === "started" && <div
          className="input"
          style={{"border": "none"}}
        >
          <input
            type="text"
            ref={textInput}
            
            onChange={((e)=>setdata(e.target.value))}
            onKeyDown={handlekeydown}
            value={data}
            placeholder="Enter the words"
          />
         
          
        </div>}
        
        <div className="start">
          <button className="button-24" onClick={changeall}>
            {status!=="started" ? "Start" : "Stop"}
          </button>
        </div>
      </div>
      <div className="bottom">
        <div className="card">
          <div className="card-content">
            {status==="started" && <div className="paragraph">
              {words.map((word, i) => (
                <span key={i}>
                 <span >
                  {word.split("").map((char,idx)=>(
                    <span className={getcharclass(i,idx,char)} key={idx}>{char}</span>
                  ))}
                 </span>
                  <span> </span>
                </span>
              ))}
            </div>}
            {status==="finished" && <div className="result">
              <div className="wpm">
                <p>Words Per Minute:</p>
                <a href="/#">{correct}</a>
              </div>
              <div className="accuracy">
                <p>Accuracy:</p>
                <a href="/#">{isNaN(accuracy)?0:accuracy}%</a>
              </div>
            </div>}
          </div>
        </div>
      </div>

      {status!=="started" && <div className="footer">CopyWrite @ Omkar Raghu</div>}
    </div>
  );
};

export default App;
