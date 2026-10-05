"use client";
import {useEffect,useRef,useState} from "react";
import {services} from "@/content/site";
const kinds=["Project","Rental","Studio"] as const;
type Kind=typeof kinds[number];
const questions=[{label:"What's your name?",placeholder:"Producer / artist name",type:"text",autocomplete:"name"},{label:"What's your email?",placeholder:"you@company.com",type:"email",autocomplete:"email"},{label:"What's your company?",placeholder:"Company or organisation",type:"text",autocomplete:"organization"},{label:"What do you have in mind?",placeholder:"Dates, venue, screen or surface specs, your creative brief and a budget range if you have one.",type:"text",autocomplete:"off"}] as const;
export function ContactForm(){
  const [step,setStep]=useState(0);const [kind,setKind]=useState<Kind>("Project");const [values,setValues]=useState(["","","",""]);const [interest,setInterest]=useState<string>(services[0].title);const [error,setError]=useState("");const container=useRef<HTMLDivElement>(null);
  useEffect(()=>{const query=new URLSearchParams(window.location.search).get("type");const frame=requestAnimationFrame(()=>{if(kinds.includes(query as Kind))setKind(query as Kind);});return()=>cancelAnimationFrame(frame);},[]);
  function go(next:number){setError("");setStep(next);requestAnimationFrame(()=>container.current?.querySelector<HTMLElement>("input,textarea,h3[tabindex]")?.focus());}
  function advance(event:React.FormEvent){event.preventDefault();if(step===0){go(1);return;}const value=(values[step-1]??"").trim();if(!value){setError("Please fill in this field to continue.");return;}if(step===2&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){setError("Please enter a valid email address.");return;}go(step+1);}
  const question=questions[step-1]??questions[0];const done=step===5;
  const emailBody=`Enquiry type: ${kind}\nName: ${values[0]}\nEmail: ${values[1]}\nCompany: ${values[2]}${kind==="Project"?`\nService interest: ${interest}`:""}\n\nBrief:\n${values[3]}`;
  function update(value:string){setValues(current=>current.map((old,index)=>index===step-1?value:old));setError("");}
  return <div className="contact-form" ref={container}>
    <div className="form-progress" role="progressbar" aria-label="Enquiry progress" aria-valuenow={Math.min(step+1,5)} aria-valuemin={0} aria-valuemax={5}><span style={{width:`${Math.min(step+1,5)*20}%`}}/></div><div className="form-topline"><button type="button" onClick={()=>go(Math.max(0,step-1))} disabled={step===0}>← Back</button><span>{done?"Review":`${step+1} / 5`}</span></div>
    {done?<div className="form-review"><h3 tabIndex={-1}>Your brief is ready.</h3><p>Review your details, then open a draft in your email app.</p><dl>{[["Enquiry",kind],["Name",values[0]],["Email",values[1]],["Company",values[2]],...(kind==="Project"?[["Service",interest]]:[]),["Brief",values[3]]].map(([label,value])=><div className="review-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><a className="pill-link" href={`mailto:studio@anayafx.com?subject=${encodeURIComponent(kind+" enquiry · "+values[2])}&body=${encodeURIComponent(emailBody)}`}>Open email draft ↗</a><p className="form-disclosure">Nothing has been sent. Your email app will open a draft for you to review and send.</p></div>:<form onSubmit={advance} noValidate>
      {step===0?<fieldset className="enquiry-kinds"><legend>How can we help?</legend>{kinds.map(option=><label key={option}><input type="radio" name="enquiry-type" checked={kind===option} onChange={()=>setKind(option)}/><span>{option}</span></label>)}</fieldset>:<>
      {step===4&&kind==="Project"&&<div className="service-interest"><label htmlFor="service-interest">Service interest</label><select id="service-interest" value={interest} onChange={event=>setInterest(event.target.value)}>{services.map(service=><option key={service.slug}>{service.title}</option>)}</select></div>}
      <label htmlFor="enquiry-input">{question.label}</label>{step===4?<textarea key={step} id="enquiry-input" value={values[step-1]} onChange={event=>update(event.target.value)} placeholder={question.placeholder} maxLength={1500} required aria-invalid={!!error} aria-describedby={error?"enquiry-error":undefined}/>:<input key={step} id="enquiry-input" type={question.type} autoComplete={question.autocomplete} value={values[step-1]} onChange={event=>update(event.target.value)} placeholder={question.placeholder} maxLength={step===2?254:120} required aria-invalid={!!error} aria-describedby={error?"enquiry-error":undefined}/>}</>}
      <div aria-live="polite">{error&&<p id="enquiry-error" className="field-error">{error}</p>}</div><div className="form-actions"><button className="button" type="submit">{step===4?"Review":"Continue"} →</button></div>
    </form>}
  </div>;
}
