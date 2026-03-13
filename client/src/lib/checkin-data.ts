import type { IconType } from "react-icons";
import {
  TbSparkles,
  TbMoonStars,
  TbCloudStorm,
  TbSkull,
  TbFlame,
  TbMoodEmpty,
  TbMoodSad,
  TbMoodNervous,
  TbSun,
  TbCloudRain,
  TbCloud,
  TbCloudBolt,
  TbBattery4,
  TbBattery2,
  TbBattery1,
  TbBatteryOff,
  TbCheck,
  TbTemperature,
  TbAlertTriangle,
  TbDoor,
  TbMoodConfuzed,
  TbMoodSmile,
  TbTrophy,
  TbZzz,
  TbMoodHappy,
  TbFriends,
  TbMoodAngry,
  TbSunrise,
  TbBriefcase,
  TbUserExclamation,
  TbUsers,
  TbUserOff,
  TbCoin,
  TbHeartbeat,
  TbDots,
  TbRun,
  TbStethoscope,
  TbHome,
  TbCar,
  TbCalendar,
  TbHourglass,
} from "react-icons/tb";

// ── Types ─────────────────────────────────────────

export type MomentId = "morning" | "midday" | "endday";

export interface StepOption {
  id: string;
  label: string;
  icon: IconType;
  score: number;
  color: string; // Tailwind color class (text-*)
  bgColor: string; // Tailwind gradient (from-*/to-*)
  flag?: string;
  sensitive?: boolean;
  triggerChat?: boolean;
  exclusive?: boolean;
}

export interface ProjectionOption {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  flag?: string;
  triggerChat?: boolean;
}

export interface ProjectionCard {
  text: string;
  sublabel: string;
  options: ProjectionOption[];
}

export interface FollowUp {
  question: string;
}

export type StepType = "single" | "projection" | "multi2" | "multi3" | "tags";

export interface CheckInStep {
  id: string;
  type: StepType;
  question: string;
  sublabel?: string;
  options: StepOption[];
  followUp?: FollowUp;
  projectionCard?: ProjectionCard;
}

export interface MomentConfig {
  id: MomentId;
  label: string;
  icon: IconType;
  time: string;
  subtitle: string;
  description: string;
}

// ── Sky & Score types ─────────────────────────────

export type SkyState = "clear" | "partly-cloudy" | "protective-cloud" | "respiro";
export type ScoreDomainId = "recarga" | "estado-do-dia" | "seguranca-relacional";

export interface ScoreDomain {
  id: ScoreDomainId;
  label: string;
  description: string;
  /** Step ids that contribute to this domain */
  questionIds: string[];
  /** Sum of max possible scores from contributing questions */
  maxRaw: number;
}

// ── Moments ───────────────────────────────────────

export const MOMENTS: Record<MomentId, MomentConfig> = {
  morning: {
    id: "morning",
    label: "Manhã",
    icon: TbSunrise,
    time: "Início do dia",
    subtitle: "Antes de entrar no trabalho",
    description:
      "Leva ~40s. Entender como você começa o dia ajuda a identificar padrões ao longo do tempo.",
  },
  midday: {
    id: "midday",
    label: "Intervalo",
    icon: TbSun,
    time: "Meio do dia",
    subtitle: "Durante ou após o almoço",
    description:
      "O momento mais importante. Captura o que acontece durante o expediente — incluindo clima no ambiente.",
  },
  endday: {
    id: "endday",
    label: "Fim do dia",
    icon: TbCloudRain,
    time: "Saída do trabalho",
    subtitle: "Depois que o expediente termina",
    description:
      "Como você fecha o dia revela muito sobre o ambiente de trabalho. Dados retrospectivos são mais honestos.",
  },
};

export const MOMENT_ORDER: MomentId[] = ["morning", "midday", "endday"];

// ── Morning steps ─────────────────────────────────

export const MORNING_STEPS: CheckInStep[] = [
  {
    id: "sleep",
    type: "single",
    question: "Como foi sua noite?",
    options: [
      { id: "restorative", label: "Restauradora", icon: TbSparkles, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "acceptable", label: "Aceitável", icon: TbMoonStars, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "agitated", label: "Agitada", icon: TbCloudStorm, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "terrible", label: "Péssima", icon: TbSkull, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
    ],
  },
  {
    id: "morning_anticipation",
    type: "single",
    question: "Como você se sente em relação ao dia que está começando?",
    sublabel: "Esse sentimento é sobre ir ao trabalho hoje.",
    options: [
      { id: "excited", label: "Com vontade", icon: TbFlame, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "ok", label: "Normal", icon: TbMoodEmpty, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "reluctant", label: "Sem muita vontade", icon: TbMoodSad, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "dreading", label: "Com receio", icon: TbMoodNervous, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", sensitive: true },
    ],
  },
  {
    id: "morning_environment_projection",
    type: "projection",
    question: "No seu ambiente de trabalho, como você percebe que as pessoas chegam geralmente?",
    sublabel: "Não precisa ser sobre você. Pense no ambiente como um todo.",
    options: [
      { id: "env_light", label: "Com leveza e confiança", icon: TbSun, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "env_ok", label: "Na média, focadas", icon: TbCloudRain, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "env_tense", label: "Com tensão no ar", icon: TbCloud, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5", flag: "climate_risk" },
      { id: "env_fear", label: "Com medo ou ansiedade", icon: TbCloudBolt, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "harassment_signal" },
    ],
  },
];

// ── Midday steps ──────────────────────────────────

export const MIDDAY_STEPS: CheckInStep[] = [
  {
    id: "energy_now",
    type: "single",
    question: "Como está seu combustível agora?",
    options: [
      { id: "full", label: "Cheio(a)", icon: TbBattery4, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "ok", label: "Ok", icon: TbBattery2, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "low", label: "Baixo", icon: TbBattery1, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "empty", label: "Zerado(a)", icon: TbBatteryOff, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
    ],
    followUp: {
      question: "Isso está atrapalhando seu trabalho hoje?",
    },
  },
  {
    id: "relational_climate",
    type: "multi2",
    question: "Como está o clima ao seu redor agora?",
    sublabel: "Não é sobre o que você sente por dentro — é sobre o que vem de fora.",
    options: [
      { id: "all_good", label: "Tranquilo por aqui", icon: TbCheck, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5", exclusive: true },
      { id: "heavy_air", label: "Clima pesado no ambiente", icon: TbTemperature, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5", flag: "climate_risk" },
      { id: "pressured", label: "Me sinto pressionado(a)", icon: TbAlertTriangle, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "harassment_signal", triggerChat: true },
      { id: "isolated", label: "Me sinto isolado(a) ou excluído(a)", icon: TbDoor, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "harassment_signal", triggerChat: true },
      { id: "uncomfortable", label: "Desconfortável por causa de alguém", icon: TbMoodConfuzed, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "harassment_signal", triggerChat: true },
    ],
    projectionCard: {
      text: "Alguém no seu ambiente pode estar passando por algo difícil?",
      sublabel: "Você pode responder pensando em outra pessoa.",
      options: [
        { id: "proj_no", label: "Não percebi nada", color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
        { id: "proj_maybe", label: "Talvez sim", color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5", flag: "peer_concern" },
        { id: "proj_yes", label: "Sim, percebi algo", color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "peer_harassment_proxy", triggerChat: true },
      ],
    },
  },
];

// ── End-of-day steps ──────────────────────────────

export const ENDDAY_STEPS: CheckInStep[] = [
  {
    id: "emotion_retrospective",
    type: "multi3",
    question: "Como você sai de hoje?",
    sublabel: "Pode escolher até 3. Emoções se misturam.",
    options: [
      { id: "relieved", label: "Aliviado(a)", icon: TbMoodSmile, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "satisfied", label: "Realizado(a)", icon: TbTrophy, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "calm", label: "Calmo(a)", icon: TbMoodHappy, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "tired", label: "Cansado(a)", icon: TbZzz, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "frustrated", label: "Frustrado(a)", icon: TbMoodAngry, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "sad", label: "Triste", icon: TbMoodSad, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "anxious", label: "Ansioso(a)", icon: TbMoodNervous, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "angry", label: "Irritado(a)", icon: TbMoodAngry, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
    ],
  },
  {
    id: "context_tags",
    type: "tags",
    question: "O que mais pesou hoje?",
    sublabel: "Opcional. Ajuda a entender o contexto, não a te identificar.",
    options: [
      { id: "work_load", label: "Volume de trabalho", icon: TbBriefcase, score: 0, color: "text-foreground", bgColor: "", flag: "workload" },
      { id: "leadership", label: "Liderança / Gestor(a)", icon: TbUserExclamation, score: 0, color: "text-foreground", bgColor: "", flag: "leadership_risk" },
      { id: "peer", label: "Colega(s)", icon: TbUsers, score: 0, color: "text-foreground", bgColor: "", flag: "peer_risk" },
      { id: "client", label: "Cliente / Externo", icon: TbFriends, score: 0, color: "text-foreground", bgColor: "", flag: "external" },
      { id: "personal", label: "Situação pessoal", icon: TbUserOff, score: 0, color: "text-foreground", bgColor: "", flag: "personal" },
      { id: "finances", label: "Finanças", icon: TbCoin, score: 0, color: "text-foreground", bgColor: "", flag: "financial_stress" },
      { id: "health", label: "Saúde", icon: TbHeartbeat, score: 0, color: "text-foreground", bgColor: "", flag: "health" },
      { id: "nothing", label: "Nada em especial", icon: TbDots, score: 0, color: "text-foreground", bgColor: "", exclusive: true },
    ],
  },
  {
    id: "tomorrow_anticipation",
    type: "single",
    question: "Como você se sente em relação a amanhã?",
    options: [
      { id: "looking_forward", label: "Com vontade", icon: TbSunrise, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "neutral", label: "Indiferente", icon: TbMoodEmpty, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "not_really", label: "Preferia não ir", icon: TbMoodSad, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5", sensitive: true },
      { id: "dreading", label: "Pensar nisso me pesa", icon: TbMoodNervous, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", sensitive: true, triggerChat: true },
    ],
  },
];

// ── Step map per moment ───────────────────────────

export const STEPS_BY_MOMENT: Record<MomentId, CheckInStep[]> = {
  morning: MORNING_STEPS,
  midday: MIDDAY_STEPS,
  endday: ENDDAY_STEPS,
};

// ── Chat trigger messages ─────────────────────────

export interface ChatTriggerConfig {
  message: string;
  cta: string;
  anonymousNote: string;
}

export const CHAT_TRIGGERS: Record<string, ChatTriggerConfig> = {
  pressured: {
    message:
      "Percebi que algo no ambiente pode estar pesando sobre você.\n\nQuer conversar? Posso só ouvir, sem cobranças.",
    cta: "Falar com a JuPhD",
    anonymousNote: "Nenhum detalhe chega ao RH sem sua autorização.",
  },
  proj_yes: {
    message:
      "Você mencionou que alguém ao seu redor pode estar passando por algo difícil.\n\nSe quiser, posso ajudar a entender a situação — seja para apoiar essa pessoa, ou se, de alguma forma, você também estiver nela.",
    cta: "Continuar em segurança",
    anonymousNote: "Você pode falar por outra pessoa. Tudo aqui é confidencial.",
  },
  dreading_tomorrow: {
    message:
      "Parece que pensar em amanhã não está sendo leve.\n\nIsso é mais comum do que parece, e você não precisa passar por isso sozinho(a).",
    cta: "Conversar agora",
    anonymousNote: "Disponível 24h. Nenhuma resposta vai ao RH.",
  },
};

// ── Helpers ───────────────────────────────────────

/** Detect which chat trigger (if any) should fire based on step answers. */
export function detectChatTrigger(
  stepId: string,
  answer: string | string[],
  steps: CheckInStep[],
  projAnswer?: ProjectionOption | null,
): string | null {
  if (projAnswer?.flag === "peer_harassment_proxy") return "proj_yes";

  const allOpts = steps.flatMap((s) => s.options);
  const ids = Array.isArray(answer) ? answer : [answer];

  for (const optId of ids) {
    const opt = allOpts.find((o) => o.id === optId);
    if (opt?.triggerChat) {
      if (opt.flag === "harassment_signal") return "pressured";
    }
    if (optId === "dreading" && stepId === "tomorrow_anticipation")
      return "dreading_tomorrow";
  }

  return null;
}

/** Collect all flags from a set of answers. */
export function collectFlags(
  answers: Record<string, string | string[]>,
  steps: CheckInStep[],
): string[] {
  const flags: string[] = [];
  const allOpts = steps.flatMap((s) => s.options);

  for (const [, val] of Object.entries(answers)) {
    const ids = Array.isArray(val) ? val : [val];
    for (const id of ids) {
      const opt = allOpts.find((o) => o.id === id);
      if (opt?.flag) flags.push(opt.flag);
    }
  }

  return Array.from(new Set(flags));
}

/** Compute total score from answers (sum of all answered option scores). */
export function computeScores(
  answers: Record<string, string | string[]>,
  steps: CheckInStep[],
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const step of steps) {
    const val = answers[step.id];
    if (!val) continue;
    const ids = Array.isArray(val) ? val : [val];
    const stepScore = ids.reduce((sum, id) => {
      const opt = step.options.find((o) => o.id === id);
      return sum + (opt?.score ?? 0);
    }, 0);
    scores[step.id] = stepScore;
  }

  return scores;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Daily check-in model (replaces 3-moment EMA in S2)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Single daily check-in: 6 questions across 3 score domains. */
export const DAILY_STEPS: CheckInStep[] = [
  // Q1: Sleep quality → Recarga
  {
    id: "sleep",
    type: "single",
    question: "Como você acordou hoje?",
    options: [
      { id: "restorative", label: "Restauradora", icon: TbSparkles, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "acceptable", label: "Aceitável", icon: TbMoonStars, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "agitated", label: "Agitada", icon: TbCloudStorm, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "terrible", label: "Péssima", icon: TbSkull, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
    ],
  },
  // Q2: Energy → Recarga
  {
    id: "energy",
    type: "single",
    question: "Quanta energia você sente que tem agora?",
    options: [
      { id: "full", label: "Cheio(a)", icon: TbBattery4, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "ok", label: "Ok", icon: TbBattery2, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "low", label: "Baixo", icon: TbBattery1, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "empty", label: "Zerado(a)", icon: TbBatteryOff, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
    ],
  },
  // Q3: Work relation → Estado do dia
  {
    id: "work_relation",
    type: "single",
    question: "Como você estava em relação ao trabalho hoje?",
    options: [
      { id: "excited", label: "Com vontade", icon: TbFlame, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "ok", label: "Normal", icon: TbMoodEmpty, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "reluctant", label: "Sem muita vontade", icon: TbMoodSad, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "dreading", label: "Com receio", icon: TbMoodNervous, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", sensitive: true },
    ],
  },
  // Q4: Emotional exit → Estado do dia
  {
    id: "day_impact",
    type: "single",
    question: "Como o dia te deixou?",
    options: [
      { id: "light", label: "Leve", icon: TbMoodSmile, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5" },
      { id: "tired_ok", label: "Cansado(a), mas ok", icon: TbZzz, score: 3, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
      { id: "frustrated", label: "Frustrado(a)", icon: TbMoodAngry, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
      { id: "overwhelmed", label: "Sobrecarregado(a)", icon: TbMoodNervous, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
    ],
  },
  // Q5: Safety signal → Segurança relacional
  {
    id: "safety",
    type: "multi2",
    question: "No seu dia de trabalho, teve algo que te deixou desconfortável ou em alerta?",
    sublabel: "Pode selecionar mais de uma opção.",
    options: [
      { id: "all_good", label: "Não, tranquilo", icon: TbCheck, score: 4, color: "text-score-good", bgColor: "from-score-good/20 to-score-good/5", exclusive: true },
      { id: "heavy_air", label: "Clima pesado no ambiente", icon: TbTemperature, score: 2, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5", flag: "climate_risk" },
      { id: "pressured", label: "Me senti pressionado(a)", icon: TbAlertTriangle, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "harassment_signal", triggerChat: true },
      { id: "isolated", label: "Me senti isolado(a) ou excluído(a)", icon: TbDoor, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "harassment_signal", triggerChat: true },
      { id: "uncomfortable", label: "Desconfortável por causa de alguém", icon: TbMoodConfuzed, score: 1, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5", flag: "harassment_signal", triggerChat: true },
    ],
  },
  // Q6: Context tags (optional, no score)
  {
    id: "context_tags",
    type: "tags",
    question: "O que mais influenciou como você ficou hoje?",
    sublabel: "Opcional. Ajuda a entender o contexto.",
    options: [
      { id: "work_load", label: "Volume de trabalho", icon: TbBriefcase, score: 0, color: "text-foreground", bgColor: "", flag: "workload" },
      { id: "leadership", label: "Liderança / Gestor(a)", icon: TbUserExclamation, score: 0, color: "text-foreground", bgColor: "", flag: "leadership_risk" },
      { id: "peer", label: "Colega(s)", icon: TbUsers, score: 0, color: "text-foreground", bgColor: "", flag: "peer_risk" },
      { id: "client", label: "Cliente / Externo", icon: TbFriends, score: 0, color: "text-foreground", bgColor: "", flag: "external" },
      { id: "personal", label: "Situação pessoal", icon: TbUserOff, score: 0, color: "text-foreground", bgColor: "", flag: "personal" },
      { id: "finances", label: "Finanças", icon: TbCoin, score: 0, color: "text-foreground", bgColor: "", flag: "financial_stress" },
      { id: "health", label: "Saúde", icon: TbHeartbeat, score: 0, color: "text-foreground", bgColor: "", flag: "health" },
      { id: "meetings", label: "Reuniões demais", icon: TbCalendar, score: 0, color: "text-foreground", bgColor: "", flag: "meetings" },
      { id: "exercise", label: "Atividade física", icon: TbRun, score: 0, color: "text-score-good", bgColor: "", flag: "exercise" },
      { id: "therapy", label: "Terapia", icon: TbStethoscope, score: 0, color: "text-brand-teal", bgColor: "", flag: "therapy" },
      { id: "family", label: "Família", icon: TbHome, score: 0, color: "text-foreground", bgColor: "", flag: "family" },
      { id: "commute", label: "Trânsito", icon: TbCar, score: 0, color: "text-foreground", bgColor: "", flag: "commute" },
      { id: "no_breaks", label: "Sem pausas", icon: TbHourglass, score: 0, color: "text-score-attention", bgColor: "", flag: "no_breaks" },
      { id: "nothing", label: "Nada em especial", icon: TbDots, score: 0, color: "text-foreground", bgColor: "", exclusive: true },
    ],
  },
];

// ── Score domains ─────────────────────────────────

export const SCORE_DOMAINS: ScoreDomain[] = [
  {
    id: "recarga",
    label: "Recarga",
    description: "Qualidade do sono e nível de energia",
    questionIds: ["sleep", "energy"],
    maxRaw: 8,
  },
  {
    id: "estado-do-dia",
    label: "Estado do dia",
    description: "Relação com o trabalho e impacto emocional",
    questionIds: ["work_relation", "day_impact"],
    maxRaw: 8,
  },
  {
    id: "seguranca-relacional",
    label: "Segurança relacional",
    description: "Conforto e segurança no ambiente de trabalho",
    questionIds: ["safety"],
    maxRaw: 4,
  },
];

// ── Daily check-in helpers ────────────────────────

/** Resolve the raw score contribution of a single question. */
function resolveQuestionScore(
  step: CheckInStep,
  val: string | string[],
): number {
  const ids = Array.isArray(val) ? val : [val];
  // For multi-select (safety), take the worst signal
  if (step.type === "multi2") {
    const scores = ids
      .map((id) => step.options.find((o) => o.id === id)?.score ?? 0)
      .filter((s) => s > 0);
    return scores.length > 0 ? Math.min(...scores) : 0;
  }
  return step.options.find((o) => o.id === ids[0])?.score ?? 0;
}

/** Compute domain scores (0–100) from daily check-in answers. */
export function computeDomainScores(
  answers: Record<string, string | string[]>,
): Record<ScoreDomainId, number> {
  const result = {} as Record<ScoreDomainId, number>;

  for (const domain of SCORE_DOMAINS) {
    let raw = 0;
    for (const qId of domain.questionIds) {
      const step = DAILY_STEPS.find((s) => s.id === qId);
      const val = answers[qId];
      if (step && val) raw += resolveQuestionScore(step, val);
    }
    // BACKLOG: calibrate weights with clinical input [post-pilot]
    result[domain.id] = Math.round((raw / domain.maxRaw) * 100);
  }

  return result;
}

/** Derive sky state and solar halo level from domain scores + flags. */
export function deriveSkyState(
  domainScores: Record<ScoreDomainId, number>,
  flags: string[],
): { skyState: SkyState; solarHaloLevel: number } {
  const hasSafetyFlag = flags.some((f) =>
    ["harassment_signal", "peer_harassment_proxy"].includes(f),
  );

  // Safety flags trump everything — enter protective mode
  if (hasSafetyFlag || domainScores["seguranca-relacional"] < 25) {
    return { skyState: "respiro", solarHaloLevel: 0 };
  }

  const overall =
    (domainScores.recarga +
      domainScores["estado-do-dia"] +
      domainScores["seguranca-relacional"]) /
    3;

  if (overall >= 75) return { skyState: "clear", solarHaloLevel: overall / 100 };
  if (overall >= 50) return { skyState: "partly-cloudy", solarHaloLevel: overall / 100 };
  if (overall >= 25) return { skyState: "protective-cloud", solarHaloLevel: overall / 100 };
  return { skyState: "respiro", solarHaloLevel: 0 };
}

// ── M3 tag system ─────────────────────────────────

/**
 * Display labels for context tag flags (PT-BR).
 * Keys must match the `flag` property of context_tags options in DAILY_STEPS.
 */
export const CONTEXT_TAG_LABELS: Record<string, string> = {
  workload: "Volume de trabalho",
  leadership_risk: "Liderança",
  peer_risk: "Colega(s)",
  external: "Cliente / Externo",
  personal: "Situação pessoal",
  financial_stress: "Finanças",
  health: "Saúde",
  meetings: "Reuniões demais",
  exercise: "Atividade física",
  therapy: "Terapia",
  family: "Família",
  commute: "Trânsito",
  no_breaks: "Sem pausas",
};

/** Flags eligible for tag cloud and discovery engine (context tags only, no system-derived flags). */
export const CONTEXT_TAG_FLAGS: string[] = Object.keys(CONTEXT_TAG_LABELS);
