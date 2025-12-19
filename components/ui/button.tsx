import { TouchableOpacity, View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { ThemedView } from '../themed-view';
import { primaryColor, Radius, Spacing } from '@/constants/theme';
import { ThemedText } from '../themed-text';

interface ButtonProps {
  onPress: ()=>void;
  title: string;
}

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress={()=>{onPress()}} style={{width:'100%', padding:Spacing.md, backgroundColor:primaryColor, borderRadius:Radius.xl, alignItems:'center', justifyContent:'center'}}>
      <ThemedText type={'subtitle'} style={{color:'white'}}>{title}</ThemedText>
    </TouchableOpacity>
  )
}