import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GameState, ProxyStats } from "@shared/schema";

export function useProxyGame(sessionId: string) {
  const queryClient = useQueryClient();
  const [isCompleted, setIsCompleted] = useState(false);

  // Get game state
  const { data: gameState, isLoading } = useQuery({
    queryKey: ["/api/game-state", sessionId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/game-state/${sessionId}`);
        if (response.status === 404) {
          // Create new game state
          const createResponse = await apiRequest("POST", "/api/game-state", {
            sessionId,
            revealedWords: [],
            guessedWords: [],
            semanticScores: "{}",
          });
          return await createResponse.json();
        }
        if (!response.ok) throw new Error("Failed to fetch game state");
        return await response.json();
      } catch (error) {
        console.error("Error fetching game state:", error);
        throw error;
      }
    },
  });

  // Get proxy stats
  const { data: proxyStats } = useQuery({
    queryKey: ["/api/proxy-stats"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Submit word mutation
  const submitWordMutation = useMutation({
    mutationFn: async (word: string) => {
      // Simulate semantic matching - in real implementation this would call the proxied API
      const similarity = Math.random() * 100;
      const isRevealed = similarity > 50;
      
      const currentScores = gameState?.semanticScores ? JSON.parse(gameState.semanticScores) : {};
      currentScores[word] = similarity;
      
      const currentGuessed = gameState?.guessedWords || [];
      const currentRevealed = gameState?.revealedWords || [];
      
      const updates: Partial<GameState> = {
        guessedWords: [...currentGuessed, word],
        semanticScores: JSON.stringify(currentScores),
      };

      if (isRevealed) {
        updates.revealedWords = [...currentRevealed, word];
      }

      // Check if game is completed (simplified logic)
      const totalRevealed = (updates.revealedWords || []).length;
      if (totalRevealed >= 20) { // Arbitrary completion threshold
        updates.isCompleted = true;
        updates.completedAt = new Date();
        setIsCompleted(true);
      }

      const response = await apiRequest("PATCH", `/api/game-state/${sessionId}`, updates);
      return {
        similarity,
        revealed: isRevealed ? [word] : [],
        gameState: await response.json(),
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/game-state", sessionId], data.gameState);
    },
  });

  useEffect(() => {
    if (gameState?.isCompleted) {
      setIsCompleted(true);
    }
  }, [gameState]);

  return {
    gameState,
    proxyStats,
    isLoading,
    isCompleted,
    submitWord: submitWordMutation.mutateAsync,
    isSubmitting: submitWordMutation.isPending,
  };
}
