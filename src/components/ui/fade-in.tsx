"use client";

import { motion, MotionConfig } from "motion/react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/** Subtle fade-up on scroll. Respects the user's reduced-motion setting. */
export function FadeIn({ children, delay = 0, className }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        data-fade
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
