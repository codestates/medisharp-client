import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import CountdownTimer from '../../components/CountdownTimer';
import AlarmList from '../../components/AlarmList';

// Get Today Checked _주간 복용 현황
const fakeGetTodayChecked = { 1: [true, true, true, true, false, true, false] };
const totalCount = fakeGetTodayChecked[1].length;
let checkCounting = function () {
  let result = 0;
  for (let m = 0; fakeGetTodayChecked[1][m] < totalCount; m++) {
    if (fakeGetTodayChecked[1][m] === true) {
      result++;
    }
  }
  return result;
};
const checkCount = checkCounting(fakeGetTodayChecked);

// Get Alarms List _CountdownTimer & AlarmList 내려주기
const fakeGetAlarmList = {
  1: [false, '13:00:00', { 1: '비염약', 2: '0', 3: '환절기만 되면 이러네 에라이...' }],
  2: [false, '18:30:00', { 1: '밀키천식약', 2: '2', 3: '밀키약 너무 비싸다..ㅠ' }],
};

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
            borderBottomColor: '#649A8D',
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
            backgroundColor: 'skyblue',
            width: window.width - 40,
            height: 240,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 120,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CountdownTimer upcomingAlarm={fakeGetAlarmList[1]} />
        </View>
        <AlarmList alarmsOnToday={fakeGetAlarmList} />
      </View>
    </View>
  );
};

export default HomeScreen;
