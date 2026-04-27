import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MuscleGroup = "chest" | "back" | "shoulders" | "biceps" | "triceps" | "forearms" | "abs" | "quadriceps" | "glutes" | "calves";

interface MuscleInfo {
  name: string;
  description: string;
}

const muscleInfo: Record<MuscleGroup, MuscleInfo> = {
  chest: { name: "Peito", description: "Pectoralis major, pectoralis minor" },
  back: { name: "Costas", description: "Latissimus dorsi, trapezius, erector spinae" },
  shoulders: { name: "Ombros", description: "Deltoids" },
  biceps: { name: "Bíceps", description: "Biceps brachii" },
  triceps: { name: "Tríceps", description: "Triceps brachii" },
  forearms: { name: "Antebraços", description: "Wrist flexors, extensors" },
  abs: { name: "Abdômen", description: "Rectus abdominis, obliques" },
  quadriceps: { name: "Quadríceps", description: "Quadriceps femoris" },
  glutes: { name: "Glúteos", description: "Gluteus maximus, medius, minimus" },
  calves: { name: "Panturrilhas", description: "Gastrocnemius, soleus" },
};

interface MuscleSelectorProps {
  selectedMuscles: MuscleGroup[];
  onMuscleToggle: (muscle: MuscleGroup) => void;
}

export default function MuscleSelector({ selectedMuscles, onMuscleToggle }: MuscleSelectorProps) {
  const [view, setView] = useState<"front" | "back">("front");

  const frontMuscles: MuscleGroup[] = ["chest", "biceps", "forearms", "abs", "quadriceps"];
  const backMuscles: MuscleGroup[] = ["back", "shoulders", "triceps", "glutes", "calves"];

  const currentMuscles = view === "front" ? frontMuscles : backMuscles;
  const muscleImageUrl = view === "front" 
    ? "https://d2xsxph8kpxj0f.cloudfront.net/310419663029913441/4Tn6oerYFPKjSbPuWS22NG/muscle-selector-front-QSRETFLyaahCpLiMathZwa.webp"
    : "https://d2xsxph8kpxj0f.cloudfront.net/310419663029913441/4Tn6oerYFPKjSbPuWS22NG/muscle-selector-back-N2CYrDaFrtXAdN5NMMtHJ8.webp";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2">Selecione os Músculos</h3>
        <p className="text-sm text-muted-foreground">Clique nos músculos para filtrar exercícios</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={view === "front" ? "default" : "outline"}
          onClick={() => setView("front")}
          className="flex-1"
        >
          Frente
        </Button>
        <Button
          variant={view === "back" ? "default" : "outline"}
          onClick={() => setView("back")}
          className="flex-1"
        >
          Costas
        </Button>
      </div>

      {/* Body Image */}
      <Card className="bg-card border-border/50 overflow-hidden">
        <div className="relative w-full aspect-square bg-background/50">
          <img
            src={muscleImageUrl}
            alt={`Músculos - Vista ${view === "front" ? "Frontal" : "Traseira"}`}
            className="w-full h-full object-cover"
          />
        </div>
      </Card>

      {/* Muscle Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {currentMuscles.map((muscle) => {
          const info = muscleInfo[muscle];
          const isSelected = selectedMuscles.includes(muscle);

          return (
            <button
              key={muscle}
              onClick={() => onMuscleToggle(muscle)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div className="font-semibold text-sm">{info.name}</div>
              <div className="text-xs opacity-75 truncate">{info.description}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Muscles Summary */}
      {selectedMuscles.length > 0 && (
        <Card className="bg-primary/10 border-primary/30 p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{selectedMuscles.length}</span> músculo(s) selecionado(s):
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedMuscles.map((muscle) => (
              <span
                key={muscle}
                className="px-2 py-1 rounded-full bg-primary/30 text-primary text-xs font-medium"
              >
                {muscleInfo[muscle].name}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Clear Selection */}
      {selectedMuscles.length > 0 && (
        <Button
          variant="outline"
          onClick={() => selectedMuscles.forEach((m) => onMuscleToggle(m))}
          className="w-full border-border"
        >
          Limpar Seleção
        </Button>
      )}
    </div>
  );
}
