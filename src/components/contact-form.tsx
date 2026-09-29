"use client";
import {useRef,useState} from "react";
import {services} from "@/content/site";
const questions=[{label:"What's your name?",placeholder:"Producer / artist name",type:"text",autocomplete:"name"},{label:"What's your email?",placeholder:"you@company.com",type:"email",autocomplete:"email"},{label:"What's your company?",placeholder:"Company or organisation",type:"text",autocomplete:"organization"},{label:"What do you have in mind?",placeholder:"Share your concert, virtual production, installation or media server requirements…",type:"text",autocomplete:"off"}] as const;
export function ContactForm(){
  const [step,setStep]=useState(0);
  const [values,setValues]=useState(["","","",""]);
  const [interest,setInterest]=useState<string>(services[0].title);
  const [error,setError]=useState("");
  const input=useRef<HTMLInputElement>(null);
  const textarea=useRef<HTMLTextAreaElement>(null);
  const review=useRef<HTMLHeadingElement>(null);
  const done=step===4;
  const question=questions[step]??questions[0];
  function advance(event:React.FormEvent){
    event.preventDefault();
    const value=(values[step]??"").trim();
    if(!value){setError("Please fill in this field to continue.");return;}
    if(step===1&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){setError("Please enter a valid email address.");return;}
    setError("");setStep(current=>current+1);
    requestAnimationFrame(()=>{if(step===3)review.current?.focus();else if(step===2)textarea.current?.focus();else input.current?.focus();});
  }
  function back(){setError("");setStep(current=>Math.max(0,current-1));requestAnimationFrame(()=>{if(step===4)textarea.current?.focus();else input.current?.focus();});}
  function update(value:string){setValues(current=>current.map((old,index)=>index===step?value:old));setError("");}
  const emailBody=`Name: ${values[0]}\nEmail: ${values[1]}\nCompany: ${values[2]}\nService interest: ${interest}\n\nProject:\n${values[3]}`;
  return <div className="contact-form">
    <div className="form-progress" role="progressbar" aria-label="Enquiry progress" aria-valuenow={Math.min(step+1,4)} aria-valuemin={0} aria-valuemax={4}><span style={{width:`${Math.min(step+1,4)*25}%`}}/></div>
    <div className="form-topline"><button type="button" onClick={back} disabled={step===0}>← Back</button><span>{done?"Review":`${step+1} / 4`}</span></div>
    {done?<div className="form-review"><h3 ref={review} tabIndex={-1}>Your brief is ready.</h3><p>Review your details, then open a draft in your email app.</p><dl>{[["Name",values[0]],["Email",values[1]],["Company",values[2]],["Service",interest],["Project",values[3]]].map(([label,value])=><div className="review-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><a className="pill-link" href={`mailto:studio@anayafx.com?subject=${encodeURIComponent("Project enquiry — "+values[2])}&body=${encodeURIComponent(emailBody)}`}>Open email draft <span aria-hidden="true">↗</span></a><p className="form-disclosure">Nothing has been sent. Your email app will open a draft for you to review and send.</p></div>:
    <form onSubmit={advance} noValidate>
      {step===3&&<div className="service-interest"><label htmlFor="service-interest">Service interest</label><select id="service-interest" value={interest} onChange={event=>setInterest(event.target.value)}>{services.map(service=><option key={service.slug}>{service.title}</option>)}</select></div>}
      <label htmlFor="enquiry-input">{question.label}</label>
      {step===3?<textarea key={step} ref={textarea} id="enquiry-input" value={values[step]} onChange={event=>update(event.target.value)} placeholder={question.placeholder} maxLength={1500} required aria-invalid={!!error} aria-describedby={error?"enquiry-error":undefined}/>:
      <input key={step} ref={input} id="enquiry-input" type={question.type} autoComplete={question.autocomplete} value={values[step]} onChange={event=>update(event.target.value)} placeholder={question.placeholder} maxLength={step===1?254:120} required aria-invalid={!!error} aria-describedby={error?"enquiry-error":undefined}/>}
      <div aria-live="polite">{error&&<p id="enquiry-error" className="field-error">{error}</p>}</div><div className="form-actions"><span>{step===3?"Review your enquiry":"Press Enter ↵"}</span><button className="button" type="submit">{step===3?"Review":"OK"} <span aria-hidden="true">→</span></button></div>
    </form>}
  </div>;
}
