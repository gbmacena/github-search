"use client";

import type React from "react";

import { useState } from "react";
import { FaGithub, FaSearch } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { Card } from "@/components/ui/card";
import type { GitHubProfile } from "@/types/index";

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
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      console.log(response.data);
      setProfile(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao buscar o perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-1 bg-black p-6 shadow-[0_0_15px_blue-700]">
          <div className="mb-6 flex items-center justify-center gap-2">
            <FaGithub className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white">Perfil GitHub</h1>
          </div>

          <form onSubmit={searchProfile} className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar usuário do GitHub"
              className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-blue-700 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus:outline-none"
              disabled={loading}
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </form>

          {loading && (
            <div className="mt-4 text-center text-white">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              <p className="mt-2">Buscando perfil...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4 text-center text-red-800">
              <p>
                Nenhum perfil foi encontrado com ese nome de usuário. Tente
                novamente.
              </p>
            </div>
          )}

          {profile && (
            <Card className="mt-4 overflow-hidden bg-gray-900 text-white">
              <div className="flex flex-col md:flex-row p-4 gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.name || profile.login}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">
                    {profile.name || profile.login}
                  </h2>
                  <p className="text-gray-400">@{profile.login}</p>
                  {profile.bio && <p className="mt-2">{profile.bio}</p>}
                  <div className="mt-3 flex flex-wrap gap-4">
                    <div>
                      <span className="font-bold">{profile.followers}</span>{" "}
                      <span className="text-gray-400">seguidores</span>
                    </div>
                    <div>
                      <span className="font-bold">{profile.following}</span>{" "}
                      <span className="text-gray-400">seguindo</span>
                    </div>
                    <div>
                      <span className="font-bold">{profile.public_repos}</span>{" "}
                      <span className="text-gray-400">repositórios</span>
                    </div>
                  </div>
                  {profile.location && (
                    <p className="mt-2 text-gray-400">
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
    </main>
  );
}
