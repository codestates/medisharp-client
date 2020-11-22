import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const CountdownTimer = (props) => {
  return (
    <View>
      <Text>다음 알람까지</Text>
      <Text>{props.upcomingAlarm[1]}</Text>
      <Text>남았습니다.</Text>
    </View>
  );
};

export default CountdownTimer;
