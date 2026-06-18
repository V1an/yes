import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ArticlePreviewProps {
  revealedWords: string[];
  totalWords: number;
  progress: number;
}

export default function ArticlePreview({ revealedWords, totalWords, progress }: ArticlePreviewProps) {
  // Mock article content with revealed/hidden words
  const renderArticleText = () => {
    const words = [
      { text: "████████", revealed: false },
      { text: "est", revealed: revealedWords.includes("est") },
      { text: "███", revealed: false },
      { text: "philosophe", revealed: revealedWords.includes("philosophe") },
      { text: "français", revealed: revealedWords.includes("français") },
      { text: "██", revealed: false },
      { text: "██████", revealed: false },
      { text: "███████", revealed: false },
      { text: ".", revealed: true },
      { text: "Né", revealed: revealedWords.includes("né") },
      { text: "██", revealed: false },
      { text: "████", revealed: false },
      { text: "à", revealed: revealedWords.includes("à") },
      { text: "█████", revealed: false },
      { text: ",", revealed: true },
      { text: "██", revealed: false },
      { text: "développe", revealed: revealedWords.includes("développe") },
      { text: "███", revealed: false },
      { text: "pensée", revealed: revealedWords.includes("pensée") },
      { text: "████████", revealed: false },
      { text: "███", revealed: false },
      { text: "influence", revealed: revealedWords.includes("influence") },
      { text: "██████████", revealed: false },
      { text: "██", revealed: false },
      { text: "monde", revealed: revealedWords.includes("monde") },
      { text: "█████████", revealed: false },
      { text: ".", revealed: true },
    ];

    return words.map((word, index) => {
      if (word.revealed && !word.text.match(/[█.]/)) {
        const similarity = Math.random() * 100; // Mock similarity score
        let bgClass = "bg-slate-200 dark:bg-slate-700";
        let textClass = "text-slate-900 dark:text-slate-100";
        
        if (similarity > 80) {
          bgClass = "semantic-500";
          textClass = "text-white";
        } else if (similarity > 60) {
          bgClass = "semantic-400";
          textClass = "text-slate-900 dark:text-slate-100";
        } else if (similarity > 40) {
          bgClass = "semantic-300";
          textClass = "text-slate-900 dark:text-slate-100";
        } else if (similarity > 20) {
          bgClass = "semantic-200";
          textClass = "text-slate-900 dark:text-slate-100";
        }

        return (
          <span
            key={index}
            className={`${bgClass} ${textClass} rounded px-1 mx-0.5 font-medium`}
          >
            {word.text}
          </span>
        );
      } else if (word.text.match(/[█]/)) {
        return (
          <span
            key={index}
            className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5"
          >
            {word.text}
          </span>
        );
      } else {
        return <span key={index} className="mx-0.5">{word.text}</span>;
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Article Mystère
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              <span>{revealedWords.length}</span> mots révélés sur <span>{totalWords}</span>
            </div>
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none text-justify leading-relaxed">
            <p className="text-base">
              {renderArticleText()}
            </p>
            
            <p className="text-base mt-4">
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ███
              </span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ████████
              </span>
              <span className={`${revealedWords.includes("principales") ? "semantic-300 text-slate-900 dark:text-slate-100" : "bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none"} rounded px-1 mx-0.5 font-medium`}>
                {revealedWords.includes("principales") ? "principales" : "████████████"}
              </span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ██████
              </span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ████
              </span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ██████████
              </span>
              <span className="mx-0.5">,</span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ██
              </span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ██████████
              </span>
              <span className={`${revealedWords.includes("et") ? "semantic-200 text-slate-900 dark:text-slate-100" : "bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none"} rounded px-1 mx-0.5 font-medium`}>
                {revealedWords.includes("et") ? "et" : "██"}
              </span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ██
              </span>
              <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-200 dark:text-slate-700 select-none rounded px-1 mx-0.5">
                ██████████
              </span>
              <span className="mx-0.5">.</span>
            </p>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
              <span>Progression</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
