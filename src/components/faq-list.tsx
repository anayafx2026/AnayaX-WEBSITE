import {faqs} from "@/content/site";
export function FaqList(){return <div className="faq-list">{faqs.map(item=><details key={item.question} name="faqs"><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;}
