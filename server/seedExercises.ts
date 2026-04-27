import { getDb } from "./db";
import { exercises } from "../drizzle/schema";

const EXERCISES_SEED = [
  // CHEST
  { name: "Supino Reto com Barra", description: "Exercício clássico para desenvolvimento do peitoral", instructions: "Deite no banco, segure a barra na largura dos ombros, desça até o peito e empurre de volta", muscleGroup: "chest", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Supino Reto com Halteres", description: "Versão com halteres para maior amplitude de movimento", instructions: "Deite no banco, segure os halteres, desça com controle e empurre de volta", muscleGroup: "chest", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Supino Inclinado com Halteres", description: "Foca na parte superior do peitoral", instructions: "Use banco inclinado a 30-45°, desça os halteres e empurre de volta", muscleGroup: "chest", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Flexão de Braço", description: "Exercício de peso corporal para o peitoral", instructions: "Posição de prancha, desça o peito até quase tocar o chão e empurre de volta", muscleGroup: "chest", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Crossover com Cabo", description: "Isolamento do peitoral com cabos", instructions: "Segure os cabos, traga as mãos para o centro cruzando na frente do corpo", muscleGroup: "chest", equipmentType: "machine", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Crucifixo com Halteres", description: "Isolamento do peitoral com amplitude", instructions: "Deite no banco, abra os braços com leve flexão nos cotovelos e feche", muscleGroup: "chest", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },

  // BACK
  { name: "Barra Fixa", description: "Exercício fundamental para as costas", instructions: "Segure a barra com pegada pronada, puxe o corpo até o queixo passar da barra", muscleGroup: "back", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Remada Curvada com Barra", description: "Exercício composto para costas e bíceps", instructions: "Incline o tronco, segure a barra e puxe em direção ao abdômen", muscleGroup: "back", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Remada com Haltere", description: "Remada unilateral para equilíbrio muscular", instructions: "Apoie um joelho no banco, puxe o haltere em direção ao quadril", muscleGroup: "back", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Puxada na Polia Alta", description: "Exercício para o latíssimo do dorso", instructions: "Sente na máquina, puxe a barra até a clavícula com pegada pronada", muscleGroup: "back", equipmentType: "machine", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Remada com Elástico", description: "Remada com faixa elástica para iniciantes", instructions: "Prenda o elástico em um ponto fixo, puxe em direção ao abdômen", muscleGroup: "back", equipmentType: "resistance-band", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Levantamento Terra", description: "Exercício composto para costas e pernas", instructions: "Pés na largura dos ombros, agarre a barra e levante estendendo quadril e joelhos", muscleGroup: "back", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "advanced" as const },

  // SHOULDERS
  { name: "Desenvolvimento com Barra", description: "Exercício principal para deltoides", instructions: "Segure a barra na altura dos ombros e empurre acima da cabeça", muscleGroup: "shoulders", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Desenvolvimento com Halteres", description: "Versão com halteres para maior amplitude", instructions: "Segure os halteres na altura dos ombros e empurre acima da cabeça", muscleGroup: "shoulders", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Elevação Lateral com Halteres", description: "Isolamento do deltóide lateral", instructions: "Eleve os halteres lateralmente até a altura dos ombros", muscleGroup: "shoulders", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Elevação Frontal com Halteres", description: "Isolamento do deltóide anterior", instructions: "Eleve os halteres à frente até a altura dos ombros", muscleGroup: "shoulders", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Elevação Lateral com Elástico", description: "Elevação lateral com resistência elástica", instructions: "Pise no elástico e eleve os braços lateralmente", muscleGroup: "shoulders", equipmentType: "resistance-band", exerciseType: "strength" as const, difficulty: "beginner" as const },

  // BICEPS
  { name: "Rosca Direta com Barra", description: "Exercício clássico para bíceps", instructions: "Segure a barra com pegada supinada e flexione os cotovelos", muscleGroup: "biceps", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Rosca Alternada com Halteres", description: "Rosca alternada para bíceps", instructions: "Alterne a flexão dos cotovelos com cada haltere", muscleGroup: "biceps", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Rosca Martelo", description: "Trabalha bíceps e braquial", instructions: "Segure os halteres com pegada neutra e flexione os cotovelos", muscleGroup: "biceps", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Rosca com Elástico", description: "Rosca bíceps com faixa elástica", instructions: "Pise no elástico e flexione os cotovelos", muscleGroup: "biceps", equipmentType: "resistance-band", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Rosca Concentrada", description: "Isolamento máximo do bíceps", instructions: "Sente, apoie o cotovelo na coxa e flexione o braço", muscleGroup: "biceps", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },

  // TRICEPS
  { name: "Tríceps Testa com Barra", description: "Exercício para cabeça longa do tríceps", instructions: "Deite no banco, desça a barra até a testa e estenda os braços", muscleGroup: "triceps", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Tríceps Pulley", description: "Exercício de isolamento para tríceps", instructions: "Segure o cabo e estenda os braços para baixo", muscleGroup: "triceps", equipmentType: "machine", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Mergulho no Banco", description: "Exercício de peso corporal para tríceps", instructions: "Apoie as mãos no banco, desça dobrando os cotovelos e empurre de volta", muscleGroup: "triceps", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Extensão de Tríceps com Haltere", description: "Extensão unilateral para tríceps", instructions: "Segure o haltere acima da cabeça e desça dobrando o cotovelo", muscleGroup: "triceps", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Tríceps com Elástico", description: "Extensão de tríceps com elástico", instructions: "Prenda o elástico acima, estenda os braços para baixo", muscleGroup: "triceps", equipmentType: "resistance-band", exerciseType: "strength" as const, difficulty: "beginner" as const },

  // ABS
  { name: "Abdominal Crunch", description: "Exercício básico para abdômen", instructions: "Deite de costas, flexione o tronco levantando os ombros do chão", muscleGroup: "abs", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Prancha", description: "Exercício isométrico para core", instructions: "Posição de prancha, mantenha o corpo reto por tempo determinado", muscleGroup: "abs", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Abdominal Bicicleta", description: "Trabalha oblíquos e reto abdominal", instructions: "Deite de costas, alterne cotovelo com joelho oposto em movimento de pedalada", muscleGroup: "abs", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Elevação de Pernas", description: "Foca na parte inferior do abdômen", instructions: "Deite de costas e eleve as pernas mantendo-as retas", muscleGroup: "abs", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Russian Twist", description: "Trabalha oblíquos com rotação", instructions: "Sente com joelhos flexionados, incline o tronco e gire de lado a lado", muscleGroup: "abs", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "intermediate" as const },

  // QUADRICEPS
  { name: "Agachamento com Barra", description: "Exercício rei para pernas", instructions: "Barra nos ombros, desça até as coxas ficarem paralelas ao chão", muscleGroup: "quadriceps", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Agachamento com Halteres", description: "Agachamento com halteres para iniciantes", instructions: "Segure os halteres ao lado do corpo e agache", muscleGroup: "quadriceps", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Agachamento Livre", description: "Agachamento sem peso para iniciantes", instructions: "Pés na largura dos ombros, desça até as coxas ficarem paralelas ao chão", muscleGroup: "quadriceps", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Leg Press", description: "Exercício para quadríceps na máquina", instructions: "Sente na máquina, empurre a plataforma estendendo os joelhos", muscleGroup: "quadriceps", equipmentType: "machine", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Avanço com Halteres", description: "Avanço para quadríceps e glúteos", instructions: "Dê um passo à frente e desça o joelho traseiro em direção ao chão", muscleGroup: "quadriceps", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Avanço com Elástico", description: "Avanço com resistência elástica", instructions: "Prenda o elástico atrás, dê passos à frente com resistência", muscleGroup: "quadriceps", equipmentType: "resistance-band", exerciseType: "strength" as const, difficulty: "beginner" as const },

  // GLUTES
  { name: "Stiff com Barra", description: "Exercício para glúteos e posteriores", instructions: "Segure a barra, incline o tronco mantendo as costas retas", muscleGroup: "glutes", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Hip Thrust com Barra", description: "Exercício principal para glúteos", instructions: "Apoie os ombros no banco, barra no quadril, eleve o quadril", muscleGroup: "glutes", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
  { name: "Glúteo no Cabo", description: "Extensão de quadril com cabo", instructions: "Prenda o cabo no tornozelo e estenda a perna para trás", muscleGroup: "glutes", equipmentType: "machine", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Ponte de Glúteos", description: "Exercício básico para glúteos", instructions: "Deite de costas, pés no chão, eleve o quadril contraindo os glúteos", muscleGroup: "glutes", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Abdução com Elástico", description: "Abdução de quadril com elástico", instructions: "Coloque o elástico acima dos joelhos e abra as pernas", muscleGroup: "glutes", equipmentType: "resistance-band", exerciseType: "strength" as const, difficulty: "beginner" as const },

  // CALVES
  { name: "Panturrilha em Pé", description: "Exercício clássico para panturrilhas", instructions: "Fique na ponta dos pés e desça controladamente", muscleGroup: "calves", equipmentType: "bodyweight", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Panturrilha Sentado", description: "Foca no músculo sóleo", instructions: "Sente com joelhos a 90°, eleve os calcanhares", muscleGroup: "calves", equipmentType: "machine", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Panturrilha com Haltere", description: "Panturrilha unilateral com haltere", instructions: "Fique em um pé, segure o haltere e eleve o calcanhar", muscleGroup: "calves", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "beginner" as const },

  // FOREARMS
  { name: "Rosca de Punho", description: "Exercício para flexores do punho", instructions: "Apoie os antebraços no banco, flexione os punhos", muscleGroup: "forearms", equipmentType: "barbell", exerciseType: "strength" as const, difficulty: "beginner" as const },
  { name: "Farmer Walk", description: "Caminhada com peso para antebraços", instructions: "Segure halteres pesados e caminhe por distância determinada", muscleGroup: "forearms", equipmentType: "dumbbell", exerciseType: "strength" as const, difficulty: "intermediate" as const },
];

export async function seedExercisesIfEmpty(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.log("[Seed] Database not available, skipping exercise seed");
      return;
    }

    const existing = await db.select().from(exercises).limit(1);
    if (existing.length > 0) {
      console.log("[Seed] Exercises already exist, skipping seed");
      return;
    }

    console.log("[Seed] Seeding exercises...");
    await db.insert(exercises).values(EXERCISES_SEED);
    console.log(`[Seed] Successfully seeded ${EXERCISES_SEED.length} exercises`);
  } catch (error) {
    console.error("[Seed] Failed to seed exercises:", error);
    // Don't throw - seed failure shouldn't crash the server
  }
}
