import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

interface ExerciseVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  videoUrl?: string;
  instructions: string;
}

export default function ExerciseVideoModal({
  isOpen,
  onClose,
  exerciseName,
  videoUrl,
  instructions,
}: ExerciseVideoModalProps) {
  // Mock video URLs - em produção, estes viriam do banco de dados
  const mockVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{exerciseName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player */}
          <div className="relative w-full aspect-video bg-background/50 rounded-lg overflow-hidden border border-border">
            {videoUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title={exerciseName}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <Play className="w-16 h-16 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Vídeo não disponível</p>
                <p className="text-xs text-muted-foreground text-center px-4">
                  Vídeos de demonstração estarão disponíveis em breve
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-background/50 p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-3">Como Executar</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {instructions}
            </p>
          </div>

          {/* Tips */}
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
            <h3 className="font-semibold text-primary mb-2">💡 Dicas Importantes</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Mantenha a forma correta durante todo o movimento</li>
              <li>Respire de forma controlada e consistente</li>
              <li>Não force além dos seus limites</li>
              <li>Comece com peso leve para aprender a técnica</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border"
            >
              Fechar
            </Button>
            <Button className="flex-1">
              Adicionar ao Treino
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
