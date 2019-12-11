import React from "react";
import WorkshopCard from "./WorkshopCard";

export default function Workshop(props){
    return <WorkshopCard Title={props.Workshop.title} Authors={props.Workshop.authors} Image={props.Workshop.image} Description={props.Workshop.description}></WorkshopCard>;
}