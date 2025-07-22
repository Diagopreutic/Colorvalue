import { useRef, useState } from "react";
import styles from "./FeedbackForm.module.css";
import layout from "./colorPicker.module.css"
import axios from "axios";
export default function FeedbackForm(){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");

    function handlesubmit(e){
        e.preventDefault();
        var formdata = new FormData(e.currentTarget);
        axios.post("/api/feedback/fb",{name:formdata.get("name"),email:formdata.get("email"),feedback:formdata.get("feedback")})
        .then(res=>alert(res.data?.done || res.data?.error))
        .catch(err=>alert("error occured please resend the feedback"))
        setName("");
        setEmail("");
        setMessage("");
    }
    return(
        <form onSubmit={(e)=>handlesubmit(e)} className={styles.form}>
            <h2>FeedBack Form</h2>
            <hr/>
            <div>
                <div>
                <input name="name" value={name} onInput={(e)=>setName(e.target.value)} required className={styles.input} type="text" placeholder="Name"/>
                <input name="email" value={email} onInput={(e)=>setEmail(e.target.value)} required className={styles.input} type="email" placeholder="Email"/>
                </div>
                <textarea name="feedback" value={message} onInput={(e)=>setMessage(e.target.value)} required className={styles.textarea}   placeholder="your Message"/>
            </div>
            <button className={layout.remove +" "+ styles.submitbtn} type="submit">Submit</button>
        </form>
    );
}