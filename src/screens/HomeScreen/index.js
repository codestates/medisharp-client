import React, { useState } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, ScrollView } from 'react-native';
import CountdownTimer from '../../components/CountdownTimer';
// import AlarmList from '../../components/AlarmList';
import Alarm from '../../components/Alarm';

// Get Today Checked _주간 복용 현황
const fakeGetTodayChecked = { 1: [true, true, true, true, false, true, false] };
const totalCount = fakeGetTodayChecked[1].length;
const checkCounting = function () {
  let result = 0;
  for (let m = 0; fakeGetTodayChecked[1][m] < totalCount; m++) {
    if (fakeGetTodayChecked[1][m] === true) {
      result++;
    }
  }
  return result;
};
const checkCount = checkCounting();

// Get Alarms List _CountdownTimer & AlarmList 내려주기
const fakeGetAlarmList = {
  1: [false, '13:00:00', { 1: '비염약', 2: '0', 3: '환절기만 되면 이러네 에라이...' }],
  2: [false, '18:30:00', { 1: '밀키천식약', 2: '2', 3: '밀키약 너무 비싸다..ㅠ' }],
};
//지금시간 : 12:43
const fakeAlarmListArry = [
  [false, '12:44:00', { 1: '비염약', 2: '0', 3: '환절기만 되면 이러네 에라이...' }],
  //이게 마지막 알람이에요!
  [false, '12:45:00', { 1: '밀키천식약', 2: '2', 3: '밀키약 너무 비싸다..ㅠ' }],
  // [false, '12:23:00', {0 1: '눈건강약', 2: '2', 3: '꼭 먹기!!!' }],
];

const window = Dimensions.get('window');

const HomeScreen = () => {
  return (
    <View
      style={{
        height: window.height,
      }}
    >
      <View
        style={{
          paddingLeft: 20,
          height: window.height - 70,
        }}
      >
        <Text
          style={{
            marginTop: 40,
            fontSize: 24,
            fontWeight: 300,
          }}
        >
          약올림
        </Text>
        <Text
          style={{
            width: 220,
            marginTop: 5,
            fontSize: 20,
            fontWeight: 500,
            paddingBottom: 5,
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
          }}
        >
          오늘도 잘 챙겨먹고 있나요?
        </Text>
        <Text
          style={{
            width: window.width * 0.85,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {'지난 7일 간 총 ' + totalCount + '회 중 ' + checkCount + '회 복용하셨군요 :)'}
        </Text>
        <View
          style={{
            borderColor: '#6a9c90',
            borderStyle: 'solid',
            borderWidth: 15,
            width: 200,
            height: 200,
            marginLeft: (window.width - 200) / 2 - 20,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* <CountdownTimer upcomingAlarm={fakeGetAlarmList[1]} /> */}
          <CountdownTimer upcomingAlarm={fakeAlarmListArry} />
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 300, marginBottom: 10, marginTop: 10 }}>
            오늘의 알람
          </Text>
          {/* <FlatList
            horizontal={true}
            style={styles.HomeAlarmList}
            keyExtractor={(item) => item.toString()}
            data={fakeAlarmListArry}
            ListHeaderComponentStyle={true}
            renderItem={({ item }) => <Alarm alarm={item} />}
          ></FlatList> */}
          <ScrollView horizontal={true} style={styles.HomeAlarmList}>
            {fakeAlarmListArry.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.HomeAlarm,
                  index === 0 && { color: 'white', backgroundColor: '#6a9c90' },
                ]}
              >
                <Text style={{ fontSize: 20, fontWeight: 500 }}>{item[2][1]}</Text>
                <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 300 }}>
                  {item[2][3]}
                </Text>
                <Text style={{ position: 'absolute', bottom: 20, fontWeight: 300 }}>
                  {item[2][2]}일 마다
                </Text>
                <Text style={{ position: 'absolute', bottom: 20, right: 10, fontWeight: 300 }}>
                  {item[1]}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  HomeAlarmList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#D7E4E1',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    height: 175,
    paddingLeft: 15,
  },
  HomeAlarm: {
    padding: 10,
    paddingTop: 20,
    width: 145,
    height: 145,
    borderRadius: 30,
    backgroundColor: '#e9efee',
    margin: 15,
    marginLeft: 0,
    shadowColor: '#313131',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  HomeAlarmFirstChile: {
    padding: 10,
    paddingTop: 20,
    width: 145,
    height: 145,
    borderRadius: 30,
    backgroundColor: '#e9efee',
    margin: 15,
    marginLeft: 0,
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

export default HomeScreen;
