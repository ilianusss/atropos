export const PLAYERS = {
  baloo: {
    name: 'Baloo',
    color: '#F4A261',
  },
  chiante: {
    name: 'Chiante',
    color: '#88C5CC',
  },
} as const;

export type PlayerId = 'baloo' | 'chiante';
