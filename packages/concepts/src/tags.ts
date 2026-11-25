import type { TagDefinition } from "@edorbit/core";

/**
 * The shared tag vocabulary. Add tags here (not ad hoc in a concept) so
 * filtering stays tidy. Subjects are broad fields; topics cut across them.
 */
export const tagVocabulary: readonly TagDefinition[] = [
  { id: "physics", label: "Physics", kind: "subject" },
  { id: "maths", label: "Maths", kind: "subject" },
  { id: "computer-science", label: "Computer science", kind: "subject" },
  { id: "chemistry", label: "Chemistry", kind: "subject" },
  { id: "biology", label: "Biology", kind: "subject" },
  { id: "earth-science", label: "Earth science", kind: "subject" },
  { id: "history", label: "History", kind: "subject" },
  { id: "economics", label: "Economics", kind: "subject" },
  { id: "music", label: "Music", kind: "subject" },
  { id: "art", label: "Art", kind: "subject" },

  { id: "space", label: "Space", kind: "topic" },
  { id: "gravity", label: "Gravity", kind: "topic" },
  { id: "motion", label: "Motion", kind: "topic" },
  { id: "history-of-science", label: "History of science", kind: "topic" },
  { id: "inventions", label: "Inventions", kind: "topic" },
  { id: "patterns", label: "Patterns", kind: "topic" },
  { id: "everyday-life", label: "Everyday life", kind: "topic" },

  { id: "experimenting", label: "Experimenting", kind: "skill" },
  { id: "predicting", label: "Predicting", kind: "skill" },
  { id: "reading-graphs", label: "Reading graphs", kind: "skill" },
  { id: "using-formulas", label: "Using formulas", kind: "skill" },
];

export const tagById = new Map(tagVocabulary.map((t) => [t.id, t]));
