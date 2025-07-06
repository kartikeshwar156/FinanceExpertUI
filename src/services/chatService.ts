import { ChatMessageType, ModalList, useSettings } from "../store/store";
import { useAuth } from "../store/store";
import { apiRefreshCalls } from "./ApiServices/ApiRefreshCalls";

const apiUrl = "https://api.openai.com/v1/chat/completions";
const IMAGE_GENERATION_API_URL = "https://api.openai.com/v1/images/generations";

export async function fetchResults(
  messages: Omit<ChatMessageType, "id" | "type">[],
  modal: string,
  signal: AbortSignal,
  onData: (data: any) => void,
  onCompletion: () => void
) {
  try {
    const latestMessage = messages[messages.length - 1];
    const question = latestMessage.content;
    const token = useAuth.getState().token;

    const response = await apiRefreshCalls.makeApiCall("http://localhost:8080/v1/user/queryLLM", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error("Error fetching results");
    }

    const data = await response.json();
    console.log(data)
    // Adjust this line to match your API's response structure
    onData(data.answer); // e.g., if your API returns { "result": "the answer" }
    onCompletion();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

export async function fetchModals() {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("apikey")}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof DOMException || error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export type ImageSize =
  | "256x256"
  | "512x512"
  | "1024x1024"
  | "1280x720"
  | "1920x1080"
  | "1024x1024"
  | "1792x1024"
  | "1024x1792";

export type IMAGE_RESPONSE = {
  created_at: string;
  data: IMAGE[];
};
export type IMAGE = {
  url: string;
};
export type DallEImageModel = Extract<ModalList, "dall-e-2" | "dall-e-3">;

export async function generateImage(
  prompt: string,
  size: ImageSize,
  numberOfImages: number
) {
  const selectedModal = useSettings.getState().settings.selectedModal;
  const token = useAuth.getState().token;

  const response = await fetch(IMAGE_GENERATION_API_URL, {
    method: `POST`,
    // signal: signal,
    headers: {
      "content-type": `application/json`,
      accept: `text/event-stream`,
      Authorization: `Bearer ${localStorage.getItem("apikey")}`,
    },
    body: JSON.stringify({
      model: selectedModal,
      prompt: prompt,
      n: numberOfImages,
      size: useSettings.getState().settings.dalleImageSize[
        selectedModal as DallEImageModel
      ],
    }),
  });
  const body: IMAGE_RESPONSE = await response.json();
  return body;
}
