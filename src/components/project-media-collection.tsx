import {readdir} from "node:fs/promises";
import path from "node:path";
import Image from "next/image";

const collectionRoot=path.join(process.cwd(),"public","media","projects");
const imageExtensions=new Set([".avif",".gif",".jpeg",".jpg",".png",".webp"]);
const videoExtensions=new Set([".mp4",".mov",".webm"]);

type Asset={name:string;src:string;type:"image"|"video"};

function publicAssetPath(folder:string,name:string){
  return `/media/projects/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`;
}

async function getCollectionAssets(folder:string):Promise<Asset[]>{
  try{
    const entries=await readdir(path.join(collectionRoot,folder),{withFileTypes:true});
    return entries
      .filter(entry=>entry.isFile())
      .map(entry=>{
        const extension=path.extname(entry.name).toLowerCase();
        if(imageExtensions.has(extension))return {name:entry.name,src:publicAssetPath(folder,entry.name),type:"image" as const};
        if(videoExtensions.has(extension))return {name:entry.name,src:publicAssetPath(folder,entry.name),type:"video" as const};
        return null;
      })
      .filter((asset):asset is Asset=>asset!==null)
      .sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"}));
  }catch{
    return [];
  }
}

export async function ProjectMediaCollection({folder,title}:{folder:string;title:string}){
  const assets=await getCollectionAssets(folder);
  if(!assets.length)return null;

  return <section className="project-collection" aria-labelledby="project-collection-heading">
    <header className="project-collection-header">
      <p className="eyebrow">Project archive</p>
      <h2 id="project-collection-heading">On site.</h2>
      <p>Additional production media from {title}.</p>
    </header>
    <div className="project-collection-grid">
      {assets.map((asset,index)=>asset.type==="video"?
        <figure className="project-collection-item project-collection-video" key={asset.src}>
          <video controls playsInline preload="metadata" disablePictureInPicture aria-label={`${title} project video ${index+1}`}>
            <source src={asset.src}/>
            Your browser does not support this video.
          </video>
          <figcaption>Production video</figcaption>
        </figure>:
        <figure className="project-collection-item" key={asset.src}>
          <div className="project-collection-image"><Image src={asset.src} alt={`${title} project still ${index+1}`} fill sizes="(max-width: 767px) 100vw, 50vw"/></div>
        </figure>,
      )}
    </div>
  </section>;
}
