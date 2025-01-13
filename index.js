const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

async function run(prompt , images) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageParts = images.map((image)=>(
        fileToGenerativePart(image.path , image.mimeType)
    ))

    console.log("the code is executed until here! ");
    console.log(`the prompt ${prompt} and images are ${images}!`);
    const result = await model.generateContent([prompt , ...imageParts]);
    const response = await result.response;
    const responseText = response.candidates[0].content.parts[0].text;
    if(!responseText){
        throw new Error("gemini is not creating content! ");
    } 
    return responseText;
}

async function cleanResponseText(prompt , images) {
    // Split text into sections
    const responseText = await run(prompt , images)
    const sections = responseText.split("\n\n");

    // Remove unnecessary whitespaces and empty lines
    const cleanedSections = sections
        .map((section) => section.trim()) // Trim extra spaces
        .filter((section) => section.length > 0); // Remove empty lines

    // Replace placeholder text
    return cleanedSections.map((section) => {
        return section
            .replace("[Search YouTube for ", "")
            .replace("[Search Coursera for ", "")
            .replace("[Search for ", "")
            .replace(/[\[\]]/g, ""); // Remove stray brackets
    }).join("\n\n"); // Join back into a formatted string
}

// Example usage
// const cleanedString = cleanResponseText(responseText);
// console.log(cleanedString);

// processSlides("can you generate the full content for ppt presentaion based on given images! " , images);

// Run the async function
// processSlides();

async function cleanAndFormatText(prompt , images) {
    const responseText = await cleanResponseText(prompt , images); 
    // Step 1: Remove stars (*) and hashes (#)
    let cleanedText = responseText.replace(/[*#]/g, "");

    // Step 2: Format links into clickable <a> tags
    cleanedText = cleanedText.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank">$1</a>'
    );

    // Step 3: Normalize spacing (remove extra newlines)
    cleanedText = cleanedText
        .replace(/\n{2,}/g, "\n\n") // Normalize multiple newlines to two
        .trim(); // Remove leading/trailing spaces

    console.log("cleaned text is: " , cleanedText);    
    return cleanedText;
}

module.exports = cleanResponseText;
// run("can you generate me content from given images if possible add relatable links and help me in understand concepts! " , images);
// module.exports = processSlides;