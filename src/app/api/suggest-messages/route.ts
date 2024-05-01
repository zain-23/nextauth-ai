import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = "edge";

export const POST = async (request: Request) => {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string.Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should suitable for a diverse audience. Avoid personal and sensitive topics, focusing instead on universal theme thar encourage friendly interaction. For example your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with mt historical figure, who would it be?||What's a simple thing make you happy?'. Ensure the questions are intriguing, foster curiousty, and contribute to positive and welcoming conversational environment.";

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      stream: true,
      prompt,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          message,
          headers,
        },
        {
          status,
        }
      );
    } else {
      console.error("An unexpected error occured", error);
      throw Error;
    }
  }
};
