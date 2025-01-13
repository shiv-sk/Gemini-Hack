/* eslint-disable react/prop-types */
import { marked } from "marked";
import DOMPurify from "dompurify";
export default function MarkedTex({markdownText}){
    const rawHtml = marked(markdownText , {breaks:true , gfm:true});
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    return(
        <div dangerouslySetInnerHTML={{__html : sanitizedHtml}} 
        style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}></div>
    )
}