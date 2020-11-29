import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: moment().format().substring(0, 10),
};
LocaleConfig.defaultLocale = 'fr';

const fakeDataGetMonthlyChecked = {
  1: [true, true, false, true, false, false, false, true, false, false],
};
const fakeDataGetClickedAlarmsList = [
  [true, '밀키약', '19:00', 0, '밀키천식약'],
  [false, '감기약', '22:00', 0, '판피린'],
  [false, '비염약', '22:30', 0, '흰색동그란약'],
];

const CalendarMain = () => {
  const [todayDate, setTodayDate] = useState(moment().format().substring(0, 10));
  const [markedDates, setMarkedDates] = useState({
    '2020-11-21': {
      customStyles: {
        container: {
          borderStyle: 'solid',
          borderBottomColor: '#6a9c90',
          borderBottomWidth: 5,
          borderRadius: 0,
        },
        text: {},
      },
    },
    '2020-11-28': {
      customStyles: {
        container: {
          borderStyle: 'solid',
          borderBottomColor: '#6a9c90',
          borderBottomWidth: 5,
          borderRadius: 0,
        },
        text: {},
      },
    },
    '2020-11-30': {
      customStyles: {
        container: {
          borderRadius: 10,
          backgroundColor: '#6a9c90',
        },
        text: { color: 'white', fontWeight: 'bold' },
      },
    },
  });
  console.log('markedDates :', markedDates);

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
      <Calendar
        // Initially visible month. Default = Date()
        current={Date()}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate={'2020-01-01'}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        maxDate={'2030-12-31'}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          console.log('selected day', day);
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={(day) => {
          console.log('selected day', day);
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy MM'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {
          console.log('month changed', month);
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
        }}
        markingType={'custom'}
        markedDates={markedDates}
      />
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
          오늘의 알람
        </Text>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ScrollView style={styles.CalendarAlarmList}>
            {fakeDataGetClickedAlarmsList.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.CalendarAlarmCheckTrue,
                  item[0] === false && styles.CalendarAlarmCheckFalse,
                ]}
              >
                <Text
                  style={[
                    styles.firstItemCheckTrue,
                    item[0] === false && styles.firstItemCheckFalse,
                  ]}
                >
                  {item[1]}
                </Text>
                <view
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={[
                      styles.secondItemCheckTrue,
                      item[0] === false && styles.secondItemCheckFalse,
                    ]}
                  >
                    {item[4]}
                  </Text>
                  <Text
                    style={[
                      styles.thirdItemCheckTrue,
                      item[0] === false && styles.thirdItemCheckFalse,
                    ]}
                  >
                    {item[3]}일 마다
                  </Text>
                  <Text
                    style={[
                      styles.fourthItemCheckTrue,
                      item[0] === false && styles.fourthItemCheckFalse,
                    ]}
                  >
                    {item[2]}
                  </Text>
                </view>
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
    borderStyle: 'solid',
    borderWidth: 1,
    height: window.height * 0.3,
    paddingBottom: 30,
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
