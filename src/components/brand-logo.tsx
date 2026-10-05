import Image from "next/image";
export function BrandLogo({symbol=false,className=""}:{symbol?:boolean;className?:string}) {
  return <Image className={`brand-logo ${className}`} src="/brand/original-logo.png" width={1920} height={321} alt="ANAYAFX" priority={symbol}/>;
}
