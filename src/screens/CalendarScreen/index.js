import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAsyncStorage } from '@react-native-community/async-storage';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

const CalendarMain = ({ navigation }) => {
  const [monthList, setMonthList] = useState([]); //캘린더 띄워져 있는 월의 모든 데이터
  const [monthCheck, setMonthCheck] = useState({}); // 해당 월의 모든 체크 값들
  const [todayDate, setTodayDate] = useState(moment().format().substring(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [nextMonth, setNextMonth] = useState(moment().add(1, 'M').format('YYYY-MM'));
  const [clickedDate, setClickedDate] = useState(todayDate);
  const [clickedList, setClickedList] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    useEffectForMonth();
    useEffectForClicked();
  }, [selectedMonth, nextMonth, navigation, clickedDate]);

  const useEffectForMonth = () => {
    console.log('++++++++++++++++++GET MONTHLY API+++++++++++++++++');
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/schedules-dates/check/month',
        headers: {
          Authorization: token,
        },
        params: {
          startDay: `${selectedMonth}-01`,
          endDay: `${nextMonth}-01`,
        },
      })
        .then((data) => {
          setMonthList(data.data.results);
          let monthCheckObj = {};
          data.data.results.map((ele) => {
            if (monthCheckObj.hasOwnProperty(selectedMonth + '-' + [ele['alarmdate']]) === false) {
              monthCheckObj[selectedMonth + '-' + ele['alarmdate']] = [ele['check']];
            } else {
              monthCheckObj[selectedMonth + '-' + ele['alarmdate']].push(ele['check']);
            }
          });
          setMonthCheck(monthCheckObj);

          let markedDateResult = {};
          for (let property in monthCheckObj) {
            // 날짜가 오늘이라면 아무것도 안함
            if (property.toString() === moment().format().substring(0, 10)) {
            }
            // false를 포함하는 경우
            if (monthCheckObj[property].includes(false) === true) {
              // true도 섞여있으면
              if (monthCheckObj[property].includes(true) === true) {
                markedDateResult[property] = {
                  customStyles: {
                    container: {
                      borderStyle: 'solid',
                      borderBottomColor: '#D3CF5F', //노란색
                      borderBottomWidth: 5,
                      borderRadius: 0,
                    },
                  },
                };
              }
              // true가 없으면
              if (monthCheckObj[property].includes(true) === false) {
                markedDateResult[property] = {
                  customStyles: {
                    container: {
                      borderStyle: 'solid',
                      borderBottomColor: '#ffaaaa', //빨간색
                      borderBottomWidth: 5,
                      borderRadius: 0,
                    },
                  },
                };
              }
              // false를 포함하지 않는 경우
            } else {
              markedDateResult[property] = {
                customStyles: {
                  container: {
                    borderStyle: 'solid',
                    borderBottomColor: '#649A8D', //초록색
                    borderBottomWidth: 5,
                    borderRadius: 0,
                  },
                },
              };
            }
          }
          //오늘 날짜는 그냥 마지막에 덮어쓰는걸루..
          (markedDateResult[todayDate] = {
            customStyles: {
              container: {
                borderRadius: 10,
                backgroundColor: '#76a991',
              },
              text: { color: 'white', fontWeight: 'bold' },
            },
          }),
            setMarkedDates(markedDateResult);
        })
        .catch((err) => {
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: () => useEffectForMonth(),
              },
            ],
            { cancelable: false },
          );
        });
    });
  };

  const useEffectForClicked = () => {
    console.log('==============Clicked Alarm List=============');
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: `http://127.0.0.1:5000/schedules-dates/schedules-commons/alarm`,
        headers: {
          Authorization: token,
        },
        params: {
          date: clickedDate,
        },
      })
        .then((data) => {
          setClickedList(data.data.results);
        })
        .catch((err) => {
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: () => useEffectForClicked(),
              },
            ],
            { cancelable: false },
          );
        });
    });
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingTop: getStatusBarHeight() + verticalMargin,
        height: window.height * 0.9,
      }}
    >
      <NavigationEvents
        onDidFocus={(payload) => {
          useEffectForMonth();
          useEffectForClicked();
        }}
      />
      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#76a991',
          padding: 10,
          paddingLeft: 25,
          paddingRight: 25,
          borderTopRightRadius: 35,
          borderBottomRightRadius: 35,
          marginBottom: verticalMargin,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '200',
            color: 'white',
          }}
        >
          약올림 캘린더
        </Text>
        <Text
          style={{
            color: 'white',
            marginTop: 5,
            fontSize: 24,
            fontWeight: 'bold',
            paddingBottom: 5,
          }}
        >
          손 안의 복용 스케쥴러
        </Text>
      </View>

      {/* -- calendar -- */}
      <View
        style={{
          marginTop: -10,
          marginBottom: 0,
        }}
      >
        <Calendar
          current={Date()}
          minDate={'2020-01-01'}
          maxDate={'2030-12-31'}
          onDayPress={(day) => {
            console.log('selected day', day);
            setClickedDate(day['dateString']);
          }}
          monthFormat={'yyyy MM'}
          onMonthChange={(month) => {
            console.log('month changed', month);
            if (month['month'] < 10) {
              //해당 분기 추가
              let before = month['month'];
              month['month'] = `0${before}`;
            }
            setSelectedMonth(`${month['year']}-${month['month']}`);
            if (month['month'] === 12) {
              console.log(typeof month['year']);
              setNextMonth(`${month['year'] + 1}-01`);
            } else {
              month['month'] = parseInt(month['month']);
              setNextMonth(`${month['year']}-${month['month'] + 1}`);
            }
            setClickedDate(todayDate);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          renderArrow={(direction) =>
            direction === 'left' ? (
              <AntDesign name="left" size={20} color="#76a991" />
            ) : (
              <AntDesign name="right" size={20} color="#76a991" />
            )
          }
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={7}
          hideDayNames={false}
          showWeekNumbers={false}
          onPressArrowLeft={(substractMonth) => substractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          disableArrowLeft={false}
          disableArrowRight={false}
          disableAllTouchEventsForDisabledDays={true}
          theme={{
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textMonthFontSize: 28,
            textDayHeaderFontSize: 16,
            todayTextColor: '#76a991',
            monthTextColor: '#76a991',
          }}
          markingType={'custom'}
          markedDates={markedDates}
        />
      </View>

      {/* -- seletDateAlarm -- */}
      <Text
        style={{
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 10,
          color: '#76a991',
        }}
      >
        {clickedDate.substring(8, 10) < 10
          ? clickedDate.substring(9, 10)
          : clickedDate.substring(8, 10)}
        일의 알람
      </Text>
      <FlatList
        data={clickedList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                console.log(item);
                navigation.navigate('AlarmUpdateScreen', {
                  item: [item],
                  clickedDate: clickedDate,
                });
              }}
            >
              <View
                style={
                  item['check'] === false
                    ? styles.CalendarAlarmCheckFalse
                    : styles.CalendarAlarmCheckTrue
                }
              >
                <Text numberOfLines={1} style={styles.alartmTitle}>
                  {item['title']}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text numberOfLines={1} style={styles.alarmContents}>
                    {item['memo']}
                  </Text>
                  <Text style={styles.alarmContents}>{item['cycle']}일 마다</Text>
                  <Text style={styles.alarmContents}>{item['time']}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  CalendarAlarmCheckTrue: {
    width: window.width - 40,
    backgroundColor: '#76a991',
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
    height: window.width * 0.24,
  },
  CalendarAlarmCheckFalse: {
    width: window.width - 40,
    backgroundColor: '#ffaaaa',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    height: window.width * 0.24,
  },
  alartmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  alarmContents: {
    marginTop: window.width * 0.04,
    fontSize: 18,
    fontWeight: '200',
    color: 'white',
  },
});

export default CalendarMain;
