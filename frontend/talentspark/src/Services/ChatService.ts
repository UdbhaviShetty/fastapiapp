import api from "./api";

export async function askCareerChat(message: string, session_id: string): Promise<string> {
  const response = await api.post("/chat/ask_career", { message, session_id });
  return response.data.response;
}