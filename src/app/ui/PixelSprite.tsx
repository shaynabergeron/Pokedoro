import React from "react";
import { motion } from "framer-motion";
import type { PokemonMood } from "../state/gameTypes";

function moodEmoji(mood: PokemonMood) {
  switch (mood) {
    case "happy": return "✨";
    case "sad": return "💧";
    case "tired": return "😴";
    default: return "•";
  }
}

/**
 * Placeholder sprite card — swap for pixel art later.
 * Keeps sizing consistent + supports mood variants.
 */
export function PixelSprite({ label, mood = "idle" }: { label: string; mood?: PokemonMood }) {
  return (
    <motion.div
      className="sprite"
      animate={{ scale: mood === "happy" ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="spriteBadge">{moodEmoji(mood)}</div>
      <motion.div
        className="spriteInner"
        animate={{ y: mood === "tired" ? 2 : 0 }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
