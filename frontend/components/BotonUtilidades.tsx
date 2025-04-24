import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const BotonUtilidades = ({ title, onPress, icon, style, textStyle }: Props) => {
  return (
    <View style={styles.shadowLight}>
      <View style={styles.shadowDark}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            style,
          ]}
        >
          <View style={styles.content}>
            {icon}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowLight: {
    shadowColor: "#ffffff", // sombra clara (luz)
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    backgroundColor: "#e8e8e8",
    borderRadius: 14,
  },
  shadowDark: {
    shadowColor: "#000000", // sombra oscura
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderRadius: 14,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  buttonPressed: {
    backgroundColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  text: {
    fontSize: 16,
    color: '#090909',
    fontWeight: '600',
    marginLeft: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});