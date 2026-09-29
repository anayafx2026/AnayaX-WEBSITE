import Image from "next/image";
import {clients} from "@/content/site";
export function ClientStrip(){return <section className="clients-section" aria-labelledby="clients-heading"><h2 id="clients-heading">Trusted on productions for</h2><div className="client-window"><div className="client-track">{[0,1].map(copy=><div className="client-group" key={copy} aria-hidden={copy===1?true:undefined}>{clients.map(client=><div className="client-logo" key={client.name}><Image src={client.logo} width={240} height={120} alt={copy===0?client.name:""}/></div>)}</div>)}</div></div></section>;}
