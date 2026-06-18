import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface WordInputProps {
  onSubmit: (word: string) => Promise<void>;
  isLoading?: boolean;
}

export default function WordInput({ onSubmit, isLoading }: WordInputProps) {
  const [word, setWord] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && !isLoading) {
      await onSubmit(word.trim().toLowerCase());
      setWord("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Label htmlFor="word-input" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Entrez un mot français pour découvrir l'article
          </Label>
          <form onSubmit={handleSubmit} className="relative">
            <Input
              id="word-input"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre mot ici..."
              className="text-lg pr-20"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              disabled={!word.trim() || isLoading}
            >
              <Search className="mr-1 h-4 w-4" />
              {isLoading ? "..." : "Valider"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
