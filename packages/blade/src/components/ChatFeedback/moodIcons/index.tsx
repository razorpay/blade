/**
 * Artwork for the four-point rating scale.
 *
 * Not exported from Blade's public entry point. These are fixed-palette faces with gradients and
 * a coloured thumb outline — they cannot honour a `color` prop, so shipping them through the icon
 * pipeline would hand consumers an icon that silently ignores half its contract. They stay here,
 * beside the only component that renders them, until there is a reason to promote them.
 *
 * Each is static at rest and animates only while its button is hovered, focused or selected.
 */
import React from 'react';
import { TerribleIcon } from './TerribleIcon';
import { BadIcon } from './BadIcon';
import { GoodIcon } from './GoodIcon';
import { LoveItIcon } from './LoveItIcon';
import type { ChatFeedbackIcons } from '~components/ChatFeedback/types';

/**
 * Ready to pass straight to `feedbackIcons`.
 *
 * Declared once and imported wherever the scale appears, so changing the artwork is one edit
 * rather than one per composer.
 */
const defaultFeedbackIcons: ChatFeedbackIcons = {
  'very-dissatisfied': <TerribleIcon />,
  dissatisfied: <BadIcon />,
  satisfied: <GoodIcon />,
  'very-satisfied': <LoveItIcon />,
};

export { defaultFeedbackIcons, TerribleIcon, BadIcon, GoodIcon, LoveItIcon };
export type { MoodIconProps } from './types';
