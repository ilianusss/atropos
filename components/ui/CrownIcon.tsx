import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
  size?: number;
  color?: string;
};

export default function CrownIcon({ size = 20, color = '#FFD700' }: Props) {
  return <MaterialCommunityIcons name="crown" size={size} color={color} />;
}
