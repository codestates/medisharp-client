import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const CalendarMain = () => {
  //여기는 제가 짠 코드입니다.
  const [monthList, setMonthList] = useState([]); //캘린더 띄워져 있는 월의 모든 데이터
  console.log('monthList:', monthList);

  const [monthCheck, setMonthCheck] = useState({}); // 해당 월의 모든 체크 값들
  console.log('monthCheck:', monthCheck);

  const [todayDate, setTodayDate] = useState(moment().format().substring(0, 10));

  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  console.log('selectedMonth:', selectedMonth);

  const [clickedDate, setClickedDate] = useState(todayDate);
  console.log('clickedDate:', clickedDate);
  const [clickedList, setClickedList] = useState([]);
  console.log('clickedList:', clickedList);
  //여기까지 제가 짠 코드입니다.

  const [markingDays, setMarkingDays] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  //여기부터 API 입니다.
  useEffect(() => {
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
          month: selectedMonth,
        },
      })
        .then((data) => {
          setMonthList(data.data.results);
          let monthCheckObj = {};
          data.data.results.map((ele) => {
            if (ele['date'] > 10) {
              if (monthCheckObj.hasOwnProperty(selectedMonth + '-' + [ele['date']]) === false) {
                monthCheckObj[selectedMonth + '-' + ele['date']] = [ele['check']];
              } else {
                monthCheckObj[selectedMonth + '-' + ele['date']].push(ele['check']);
              }
            } else {
              if (
                monthCheckObj.hasOwnProperty(selectedMonth + '-' + '0' + [ele['date']]) === false
              ) {
                monthCheckObj[selectedMonth + '-' + '0' + ele['date']] = [ele['check']];
              } else {
                monthCheckObj[selectedMonth + '-' + '0' + ele['date']].push(ele['check']);
              }
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
                      borderBottomColor: '#9A6464', //빨간색
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
                backgroundColor: '#6a9c90',
              },
              text: { color: 'white', fontWeight: 'bold' },
            },
          }),
            console.log('markedDateResult =>', markedDateResult);
          setMarkedDates(markedDateResult);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, [selectedMonth]);

  useEffect(() => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: `http://127.0.0.1:5000/schedules-dates/schedules-commons/alarm/today`,
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
          console.error(err);
        });
    });
  }, [clickedDate]);

  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <View
        style={{
          paddingLeft: 20,
        }}
      >
        <Text
          style={{
            marginTop: 40,
            fontSize: 24,
          }}
        >
          약올림 캘린더
        </Text>
        <View
          style={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
            alignSelf: 'flex-start',
            marginBottom: 15,
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
            손 안의 복용 스케쥴러
          </Text>
        </View>
      </View>
      <ScrollView
        style={{
          maxHeight: 350,
        }}
      >
        <Calendar
          style={{}}
          current={Date()}
          minDate={'2020-01-01'}
          maxDate={'2030-12-31'}
          onDayPress={(day) => {
            console.log('selected day', day);
            setClickedDate(day['dateString']);
          }}
          // Handler which gets executed on day long press. Default = undefined
          // onDayLongPress={(day) => {
          //   console.log('selected day', day);
          // }} -> 상현님 무지한 저는 이 코드를 이해할 수 없어서 우선 비활성화했습니다 ㅠ
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting

          monthFormat={'yyyy MM'}
          onMonthChange={(month) => {
            console.log('month changed', month);
            setSelectedMonth(`${month['year']}-${month['month']}`);
            setClickedDate(todayDate);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          renderArrow={(direction) =>
            direction === 'left' ? (
              <AntDesign name="left" size={20} color="#6a9c90" />
            ) : (
              <AntDesign name="right" size={20} color="#6a9c90" />
            )
          }
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Hide day names. Default = false
          hideDayNames={false}
          // Show week numbers to the left. Default = false
          showWeekNumbers={false}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={(substractMonth) => substractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={(addMonth) => addMonth()}
          // Disable left arrow. Default = false
          disableArrowLeft={false}
          // Disable right arrow. Default = false
          disableArrowRight={false}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={true}
          /** Replace default month and year title with custom one. the function receive a date as parameter. */
          //renderHeader={(date) => {/*Return JSX*/}}
          theme={{
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textMonthFontSize: 26,
            textDayHeaderFontSize: 16,
            todayTextColor: '#6a9c90',
          }}
          markingType={'custom'}
          markedDates={markedDates}
        />
      </ScrollView>
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '300',
            marginLeft: 20,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          {clickedDate.substring(8, 10) < 10
            ? clickedDate.substring(9, 10)
            : clickedDate.substring(8, 10)}
          일의 알람
        </Text>
        <View style={{ alignItems: 'center' }}>
          <ScrollView style={styles.CalendarAlarmList}>
            {clickedList.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.CalendarAlarmCheckTrue,
                  item['check'] === false && styles.CalendarAlarmCheckFalse,
                ]}
              >
                <Text
                  style={[
                    styles.firstItemCheckTrue,
                    item['check'] === false && styles.firstItemCheckFalse,
                  ]}
                >
                  {item['title']}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={[
                      styles.secondItemCheckTrue,
                      item['check'] === false && styles.secondItemCheckFalse,
                    ]}
                  >
                    {item['memo']}
                  </Text>
                  <Text
                    style={[
                      styles.thirdItemCheckTrue,
                      item['check'] === false && styles.thirdItemCheckFalse,
                    ]}
                  >
                    {item['cycle']}일 마다
                  </Text>
                  <Text
                    style={[
                      styles.fourthItemCheckTrue,
                      item['check'] === false && styles.fourthItemCheckFalse,
                    ]}
                  >
                    {item['time']}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  CalendarAlarmList: {
    height: window.height * 0.3,
  },
  CalendarAlarmCheckTrue: {
    width: window.width - 40,
    backgroundColor: '#6a9c90',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    height: 70,
  },
  CalendarAlarmCheckFalse: {
    width: window.width - 40,
    backgroundColor: '#e9efee',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    height: 70,
  },
  firstItemCheckTrue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  secondItemCheckTrue: {
    marginBottom: 10,
    marginRight: 20,
    fontWeight: '400',
    color: 'white',
  },
  thirdItemCheckTrue: {
    position: 'absolute',
    right: window.width * 0.3,
    bottom: 20,
    color: 'white',
    marginRight: 20,
  },
  fourthItemCheckTrue: {
    position: 'absolute',
    bottom: 20,
    color: 'white',
    right: 15,
  },

  firstItemCheckFalse: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#313131',
  },
  secondItemCheckFalse: {
    marginBottom: 10,
    marginRight: 20,
    fontWeight: '400',
    color: '#313131',
  },
  thirdItemCheckFalse: {
    position: 'absolute',
    right: window.width * 0.3,
    bottom: 20,
    color: '#313131',
    marginRight: 20,
  },
  fourthItemCheckFalse: {
    position: 'absolute',
    bottom: 20,
    color: '#313131',
    right: 15,
  },
});

export default CalendarMain;
