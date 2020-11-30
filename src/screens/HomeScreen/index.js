import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { View, Text, Dimensions, FlatList, StyleSheet, ScrollView } from 'react-native';
import CountdownTimer from '../../components/CountdownTimer';
// import AlarmList from '../../components/AlarmList';
import Alarm from '../../components/Alarm';

const fakeAlarmListArry = [
  [false, '12:44:00', { 1: '비염약', 2: '0', 3: '환절기만 되면 이러네 에라이...' }],
  [false, '12:45:00', { 1: '밀키천식약', 2: '2', 3: '밀키약 너무 비싸다..ㅠ' }],
  [false, '12:23:00', { 1: '눈건강약', 2: '2', 3: '꼭 먹기!!!' }],
];

const window = Dimensions.get('window');

const HomeScreen = () => {
  const [fakeGetTodayChecked, setfakeGetTodayChecked] = useState([]);
  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/schedules-dates/check/today',
      headers: {
        Authorization:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.UgGrWBSBD2t1PHbjRRr3kSqWr3ECc65oXndQaaCrKqc',
      },
      params: {
        start_day: moment().subtract(8, 'd').format('YYYY-MM-DD'), //2020-11-22
        end_day: moment().subtract(1, 'd').format('YYYY-MM-DD'), //2020-11-29
      },
    })
      .then((datas) => {
        console.log('today checked: ', datas);
        setfakeGetTodayChecked(datas.data.results);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  console.log('fakeGetTodayChecked', fakeGetTodayChecked);

  const totalCount = fakeGetTodayChecked.length;
  const checkCounting = function () {
    let cnt = 0;
    fakeGetTodayChecked.forEach(function (el) {
      console.log(el, cnt);
      cnt += el.check ? 1 : 0;
    });
    return cnt;
  };
  const checkCount = checkCounting();
  console.log('checkCount: ', checkCount);

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
            fontWeight: '300',
          }}
        >
          약올림
        </Text>
        <View
          style={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
            alignSelf: 'flex-start',
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 5,
              fontSize: 20,
              fontWeight: 'bold',
              paddingBottom: 5,
            }}
          >
            오늘도 잘 챙겨먹고 있나요?
          </Text>
        </View>
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
          <Text style={{ fontSize: 18, fontWeight: '300', marginBottom: 10, marginTop: 10 }}>
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

          <ScrollView horizontal={true}>
            <View style={styles.HomeAlarmList}>
              {fakeAlarmListArry.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.HomeAlarm,
                    index === 0 && { color: 'white', backgroundColor: '#6a9c90' },
                  ]}
                >
                  <Text style={[styles.firstItemInAlarm, index === 0 && { color: 'white' }]}>
                    {item[2][1]}
                  </Text>
                  <Text style={[styles.secondItemInAlarm, index === 0 && { color: 'white' }]}>
                    {item[2][3]}
                  </Text>
                  <Text style={[styles.thirdItemInAlarm, index === 0 && { color: 'white' }]}>
                    {item[2][2]}일 마다
                  </Text>
                  <Text style={[styles.fourthItemInAlarm, index === 0 && { color: 'white' }]}>
                    {item[1]}
                  </Text>
                </View>
              ))}
            </View>
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
  firstItemInAlarm: { fontSize: 20, fontWeight: '600', color: '#313131' },
  secondItemInAlarm: { marginTop: 10, marginBottom: 10, fontWeight: '400', color: '#313131' },
  thirdItemInAlarm: {
    position: 'absolute',
    left: 15,
    bottom: 20,
    fontWeight: '400',
    color: '#313131',
  },
  fourthItemInAlarm: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    fontWeight: '400',
    color: '#313131',
  },
});

export default HomeScreen;
