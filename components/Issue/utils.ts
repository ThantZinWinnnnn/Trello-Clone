// import { I } from "./CreateIssue";

// export const throttle = (func: (value: I) => void,limit:number)=>{
//     let inThrottle = false;
//     return function(...args:I){
//         if(!inThrottle){
//             func(...args);
//             inThrottle = true;
//             setTimeout(()=>{
//                 inThrottle = false;
//             },limit);
//         }
//     }
// }