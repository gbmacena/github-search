"use client";

import type React from "react";
import { useState } from "react";
import { FaGithub, FaSearch } from "react-icons/fa";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { GitHubProfile } from "@/types/index";
import { fetchGitHubProfile } from "@/service/index";
import axios from "axios";

export default function GitHubProfileFinder() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const data = await fetchGitHubProfile(username);
      setProfile(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError(
            "Nenhum perfil foi encontrado com ese nome de usuário. Tente novamente."
          );
        } else {
          setError("Ocorreu um erro. Tente novamente mais tarde.");
        }
      } else {
        setError("Erro desconhecido. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center p-4 bg-[#1F1F1F] overflow-hidden">
      <div className="w-full flex justify-center z-10">
        <div className="bg-black p-8 h-auto md:h-[500px] flex flex-col flex-grow max-w-[95%] md:max-w-[1300px]">
          <div className="mb-6 flex items-center justify-center gap-2">
            <FaGithub className="h-8 w-8 md:h-10 md:w-10 text-white" />
            <h1 className="text-2xl md:text-4xl text-white">
              Perfil <span className="font-bold">GitHub</span>
            </h1>
          </div>

          <form onSubmit={searchProfile} className="flex justify-center">
            <div className="flex w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="Buscar usuário do GitHub"
                className="flex-1 rounded-md bg-gray-white px-4 py-2 md:py-4 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full rounded-md bg-blue-600 px-3 md:px-5 text-white hover:bg-blue-700 focus:outline-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                ) : (
                  <FaSearch className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </button>
            </div>
          </form>

          {loading && (
            <div className="mt-4 text-center text-white">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              <p className="mt-2">Buscando perfil...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 w-full md:w-[70%] mx-auto rounded-md border border-red-300 bg-red-50 p-4 text-center text-red-800">
              <p>{error}</p>
            </div>
          )}

          {profile && (
            <Card className="mt-8 overflow-hidden p-3 bg-zinc-200 text-white w-full md:w-[70%] mx-auto flex flex-col md:flex-row items-center z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start p-4 gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.name || profile.login}
                    width={150}
                    height={150}
                    className="rounded-full border-2 border-blue-600"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-black flex flex-col justify-center">
                  <h2 className="text-lg md:text-xl font-bold text-blue-600">
                    {profile.name || profile.login}
                  </h2>
                  <p className="text-gray-700">@{profile.login}</p>
                  {profile.bio && (
                    <p className="mt-2 max-h-24 overflow-y-auto break-words">
                      {profile.bio}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4">
                    <div>
                      <span className="font-bold">{profile.followers}</span>{" "}
                      <span className="text-gray-700">seguidores</span>
                    </div>
                    <div>
                      <span className="font-bold">{profile.following}</span>{" "}
                      <span className="text-gray-700">seguindo</span>
                    </div>
                    <div>
                      <span className="font-bold">{profile.public_repos}</span>{" "}
                      <span className="text-gray-700">repositórios</span>
                    </div>
                  </div>
                  {profile.location && (
                    <p className="mt-2 text-gray-700">
                      <span className="mr-1">📍</span>
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      <div className="hidden 2xl:block">
        <Image
          src="/Camada_1.png"
          alt="teste"
          width={200}
          height={150}
          className="absolute top-[11%] left-[11%]"
          loading="lazy"
        />
        <Image
          src="/Ellipse 1.png"
          alt="teste"
          width={400}
          height={100}
          className="absolute top-[0%] right-[0%] w-[600px] h-[400px]"
          loading="lazy"
        />
        <Image
          src="/Ellipse 2.png"
          alt="teste"
          width={200}
          height={100}
          className="absolute top-[30%] left-[0%]"
          loading="lazy"
        />
      </div>
    </main>
  );
}
