import {AlertCircle,CheckSquare,Bookmark} from "lucide-react"
import {DoubleArrowDownIcon,DoubleArrowUpIcon,ArrowUpIcon,ArrowDownIcon} from "@radix-ui/react-icons"

export const imgArr = [
    {
        id:"1",
        img:"/photos/av1.jpeg",
        name:"Leo"
    },
    {
        id:"2",
        img:"/photos/av2.jpeg",
        name:"Thant Zin"
    },
    {
        id:"3",
        img:"/photos/av3.jpeg",
        name:"Aung Zaw"
    },
    {
        id:"4",
        img:"/photos/av4.jpeg",
        name:"Win Nandar"
    },
    {
        id:"5",
        img:"/photos/av5.jpeg",
        name:"Zin Win"
    },
];

export const piorityArr = [
    {
        value:"Highest",
        icon:DoubleArrowUpIcon,
        color:'text-red-500'
    },
    {
        value:"Medium",
        icon:ArrowUpIcon,
        color:'text-red-500'
    },
    {
        value:"Low",
        icon:ArrowDownIcon,
        color:'text-green-500'
    },
    {
        value:"Lowest",
        icon:DoubleArrowDownIcon,
        color:'text-green-500'
    },
]


export const dndData = [
    {
        id:"ec35a04d-8589-4577-830c-8b78d858ed63",
        title:"todo",
        todos:[
            {
                id:"1baa8ff3-6133-446a-a3f4-5ca8461ae7e1",
                desc:"To learn nextjs"
            },
            {
                id:"5884da65-4078-40a4-ac44-68d7f100fa0b",
                desc:"To study dnd"
            },
            {
                id:"1f55debb-bf73-475f-a1fd-8714705c9c73",
                desc:"To watch youtube"
            },  
        ]
    },
    {
        id:"094705e2-03ba-4d93-8e3f-b7b68be76ee3",
        title:"progress",
        todos:[
            {
                id:"4b11f8f3-6882-4f24-b1fc-25cec7cd3509",
                desc:"developing trello clone"
            },
            {
                id:"66f682f4-cfa8-4d9a-9deb-a0e1fd8f1085",
                desc:"learning react native"
            },
            {
                id:"e2128c15-af37-4c48-b55d-1486ac2e3998",
                desc:"driving car"
            },  
        ]
    },
    {
        id:"b7663d42-f51b-4782-92c0-0272a80875a4",
        title:"done",
        todos:[
            {
                id:"ec013a20-b458-4fde-b035-830674334b62",
                desc:"gone to Pagoda"
            },
            {
                id:"7d0d89db-b5ff-4763-a796-a9ec0e43bf08",
                desc:"to make happy everybody"
            },
            {
                id:"c9f1dc00-c0ae-4e68-ae68-715fc1ec6f56",
                desc:"To remind someone to make a habit"
            },  
        ]
    },
    {
        id:"90c23a41-f574-426d-b0f1-3af46c7a10af",
        title:"backlog",
        todos:[
            {
                id:"c41342b9-ff0c-4596-b5e0-a415019c8382",
                desc:"to walk every 60 minutes"
            },
            {
                id:"fe2ccee8-bdd3-4ab5-8067-0bdd9cec2a26",
                desc:"To ask for help"
            },
            {
                id:"21303fea-3555-4157-9719-ea36aa025434",
                desc:"To change ui design "
            },  
        ]
    },
];

export const issueType = [
    {
        text:"Task",
        icon:CheckSquare,
        color:'bg-[#0070f3]'
    },
    {
        text:"Bug",
        icon:AlertCircle,
        color:'bg-[#f43f5e]'
    },
    {
        text:"story",
        icon:Bookmark,
        color:'bg-[#58249c]'
    },
]