import axios from "axios";
import type { GitHubProfile } from "@/types/index";

export async function fetchGitHubProfile(
  username: string
): Promise<GitHubProfile> {
  if (!username.trim()) {
    throw new Error("O nome de usuário não pode estar vazio.");
  }

  try {
    const response = await axios.get<GitHubProfile>(
      `https://api.github.com/users/${username}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("Erro desconhecido ao buscar o perfil.");
    }
  }
}
