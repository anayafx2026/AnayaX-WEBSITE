import {clients} from "@/content/site";
import {MediaPlaceholder} from "./media-placeholder";
export function ClientStrip(){return <section className="clients-section" aria-labelledby="clients-heading"><h2 id="clients-heading">Trusted on productions for</h2><div className="client-window"><div className="client-track">{[0,1].map(copy=><div className="client-group" key={copy} aria-hidden={copy===1?true:undefined}>{clients.map(client=><MediaPlaceholder key={client} kind="foto" label={`Logo · ${client}`}/>)}</div>)}</div></div></section>;}
