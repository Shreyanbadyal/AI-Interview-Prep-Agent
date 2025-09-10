// app/api/vapi/generate/route.ts
import { getRandomInterviewCover } from "@/lib/utils";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { db } from "@/firebase/admin";

export async function GET() {
    return Response.json({ success: true, data: "Thankyou!" }, { status: 200 });
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userId } = await request.json();

    try {
        const { text: questions } = await generateText({
            // Uses OPENAI_API_KEY from env by default; you can also pass openai({ apiKey: process.env.OPENAI_API_KEY })
            model: openai("gpt-4o-mini"),
            prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]

Thank you! <3
`,
        });

        const interview = {
            role,
            type,
            level,
            techstack: String(techstack).split(","),
            questions: JSON.parse(questions),
            userId,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);
        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, error }, { status: 500 });
    }
}
