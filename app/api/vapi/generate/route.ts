import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    // ✅ Basic validation (can be expanded further)
    if (!role || !level || !type || !userid || !amount) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]
`;

    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    let questions: string[];

    try {
      questions = JSON.parse(rawQuestions);
      if (!Array.isArray(questions)) throw new Error("Invalid question format");
    } catch {
      return Response.json(
        { success: false, error: "Failed to parse questions" },
        { status: 500 }
      );
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack ? techstack.split(",") : [],
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error generating interview:", error);
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
