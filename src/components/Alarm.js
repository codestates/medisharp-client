import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Alarm = ({ alarm }) => {
  console.log('alarm:', alarm);
  return (
    <View style={styles.HomeAlarm}>
      <Text style={{ fontSize: 20, fontWeight: '500' }}>{alarm[2][1]}</Text>
      <Text style={{ marginTop: 10, marginBottom: 10 }}>{alarm[2][3]}</Text>
      <Text style={{ position: 'absolute', bottom: 20 }}>{alarm[2][2]}일 마다</Text>
      <Text style={{ position: 'absolute', bottom: 20, right: 10 }}>{alarm[1]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  HomeAlarm: {
    padding: 10,
    paddingTop: 20,
    width: 145,
    height: 145,
    borderRadius: 30,
    backgroundColor: '#e9efee',
    margin: 15,
    marginLeft: 0,
    color: '#313131',
    shadowColor: '#313131',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
});

export default Alarm;
