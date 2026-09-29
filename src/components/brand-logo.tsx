import Image from "next/image";
export function BrandLogo({symbol=false,className=""}:{symbol?:boolean;className?:string}) {
  return <Image className={`brand-logo ${className}`} src={symbol?"/brand/symbol.png":"/brand/wordmark.png"} width={symbol?489:2322} height={422} alt="Anaya FX" unoptimized priority={symbol}/>;
}
