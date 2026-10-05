import type {Metadata} from "next";
import {RentalsStory} from "@/components/rentals-story";
export const metadata:Metadata={title:"Rentals",description:"ANAYAFX rents disguise media servers and complete show-ready racks from our own inventory.",alternates:{canonical:"/rentals"}};
export default function RentalsPage(){return <main id="contenido" tabIndex={-1} className="rentals-page"><RentalsStory/></main>;}
