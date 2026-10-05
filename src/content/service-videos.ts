// Video shown for each service: pinned on its page and as the hover preview in the services list.
export const serviceVideos:Record<string,string|readonly string[]|undefined>={
  "spatial-projection-and-special-fx":"/videos/spatial-projection.mp4",
  "show-direction-and-pre-production":"/videos/show-direction.mp4",
  "virtual-production-and-broadcast":"/videos/virtual-production.mp4",
  "immersive-and-interactive-experiences":"/videos/immersive.mp4",
  "media-servers-and-massive-infrastructure":["/videos/media-servers-a.mp4","/videos/media-servers-b.mp4"],
};
export const defaultServiceVideo="/videos/services-hero.mp4";
export const previewVideo=(slug:string)=>{const video=serviceVideos[slug];return typeof video==="string"?video:video?.[0]??defaultServiceVideo;};
