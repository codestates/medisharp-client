import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'moment/locale/ko';
import moment from 'moment';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onChange } from 'react-native-reanimated';
import CameraScreen from '../CameraScreen';
import { createStackNavigator } from 'react-navigation-stack';

const window = Dimensions.get('window');

const Alarm = ({ navigation, route }) => {
  const weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const [nowHour, setNowHour] = useState(moment().format().substring(11, 13) + 12);
  const [nowMinute, setNowMinute] = useState(moment().format().substring(14, 16));
  const [alarmTitle, setAlarmTitle] = useState('');
  const [alarmDate, setAlarmDate] = useState(moment().format().substring(0, 10));
  const [startYear, setStartYear] = useState(moment().format().substring(0, 4));
  const [startMonth, setStartMonth] = useState(moment().format().substring(5, 7));
  const [startDate, setStartDate] = useState(moment().format().substring(8, 10));
  const [startDay, setStartDay] = useState(moment().format('dddd'));
  const [endYear, setEndYear] = useState(moment().format().substring(0, 4));
  const [endMonth, setEndMonth] = useState(moment().format().substring(5, 7));
  const [endDate, setEndDate] = useState(moment().format().substring(8, 10));
  const [endDay, setEndDay] = useState(moment().format('dddd'));
  const [showTime, setShowTime] = useState([]);
  const [alarmMemo, setAlarmMemo] = useState('');
  const [alarmMedicine, setAlarmMedicine] = useState(['fake1', 'fake2', 'fake3']);
  const [startDatePickerShow, setStartDatePickerShow] = useState(false);
  const [endDatePickerShow, setEndDatePickerShow] = useState(false);
  const [timePickerShow, setTimePickerShow] = useState(false);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');

  const koreanStandardTime = Date.UTC(startYear, startMonth - 1, startDate, nowHour, nowMinute, 0);
  const [date, setDate] = useState(new Date(koreanStandardTime));

  const onPressStartDate = () => {
    setStartDatePickerShow(!startDatePickerShow);
  };
  const onPressEndDate = () => {
    setEndDatePickerShow(!endDatePickerShow);
  };

  const onChangeStartDate = (event, selectedDate) => {
    setStartDatePickerShow(!startDatePickerShow);
    const startDate = selectedDate || date;
    setDate(startDate);

    const startDateToShowYear = startDate.getFullYear();
    const startDateToShowMonth = startDate.getMonth();
    const startDateToShowDate = startDate.getDate();
    const startDateToShowDay = weekName[startDate.getDay()];

    setStartYear(startDateToShowYear);
    setStartMonth(startDateToShowMonth + 1);
    setStartDate(startDateToShowDate);
    setStartDay(startDateToShowDay);
  };

  const onChangeEndDate = (event, selectedDate) => {
    setEndDatePickerShow(!endDatePickerShow);
    const endDate = selectedDate || date;
    setDate(endDate);

    const endDateToShowYear = endDate.getFullYear();
    const endDateToShowMonth = endDate.getMonth();
    const endDateToShowDate = endDate.getDate();
    const endDateToShowDay = weekName[endDate.getDay()];

    setEndYear(endDateToShowYear);
    setEndMonth(endDateToShowMonth + 1);
    setEndDate(endDateToShowDate);
    setEndDay(endDateToShowDay);
  };

  const onPressTime = () => {
    setTimePickerShow(!timePickerShow);
  };

  const onChangeTime = (event, selectedTime) => {
    setTimePickerShow(!timePickerShow);

    const selectedHourInPicker = selectedTime.toString().substring(16, 18);
    const selectedMinuteInPicker = selectedTime.toString().substring(19, 21);

    setSelectedHour(selectedHourInPicker);
    setSelectedMinute(selectedMinuteInPicker);

    setShowTime([...showTime, selectedHourInPicker + '시' + ' ' + selectedMinuteInPicker + '분']);
  };

  const onPressAlarmMedicinDelete = () => {
    //여기는 alarmMedicine 배열에서 해당 시간값 빼기
    console.log('AlarmMedicine deleted!');
  };

  console.log('showTime => ', showTime);
  return (
    <View
      style={{
        height: window.height,
      }}
    >
      <ScrollView
        style={{
          backgroundColor: 'white',
          paddingLeft: 20,
          height: window.height * 0.92 - 1,
        }}
      >
        {/* -- 알람 이름 입력 뷰 -- */}
        <View
          style={{
            marginTop: 40,
            marginBottom: window.height * 0.01,
            borderBottomWidth: 2,
            borderBottomColor: '#6A9C90',
            borderStyle: 'solid',
            width: window.width - 40,
          }}
        >
          <TextInput
            style={{
              marginTop: 10,
              marginBottom: 5,
              fontSize: 24,
              fontWeight: '300',
              width: window.width - 40,
              paddingBottom: 5,
            }}
            placeholder="알람 이름을 입력하세요 :)"
            placeholderTextColor={'gray'}
            maxLength={10}
            onChangeText={(alarmTitle) => setAlarmTitle(alarmTitle)}
            defaultValue={alarmTitle}
          />
        </View>

        {/* -- 날짜 선택 뷰 -- */}
        <View style={styles.viewBox}>
          <View style={styles.seclectView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="calendar-alt" size={25} color={'#D6E4E1'} />
              <Text style={styles.seclectText}>시작 날짜</Text>
            </View>
            {startDatePickerShow && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeStartDate}
              />
            )}
            <TouchableOpacity onPress={onPressStartDate}>
              <Text style={styles.seclectText}>
                {startMonth}월 {startDate}일 {startDay}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.seclectView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="calendar-alt" size={25} color={'transparent'} />
              <Text style={styles.seclectText}>종료 날짜</Text>
            </View>
            {endDatePickerShow && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeEndDate}
              />
            )}
            <TouchableOpacity onPress={onPressEndDate}>
              <Text style={styles.seclectText}>
                {endMonth}월 {endDate}일 {endDay}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* -- 시간 선택 뷰 -- */}
        <View style={styles.viewBox}>
          <View style={styles.seclectView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock" size={24} color={'#D6E4E1'} />
              <Text style={styles.seclectText}>시간 설정</Text>
            </View>
            {timePickerShow && (
              <DateTimePicker value={date} mode="time" display="spinner" onChange={onChangeTime} />
            )}
            <TouchableOpacity onPress={onPressTime}>
              <Text style={{ fontSize: 16 }}>
                시간 추가{'  '}
                <Icon name="plus-square" size={20} color={'#6A9C90'} style={{ paddingBottom: 3 }} />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              horizontal={true}
              data={showTime}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <View
                    style={{
                      margin: 5,
                      alignSelf: 'flex-start',
                      borderWidth: 1,
                      borderColor: '#939393',
                      borderStyle: 'solid',
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text style={{ fontSize: 18, textAlign: 'right', marginRight: 5 }}>
                      {item}
                      {'  '}
                      <Icon
                        onPress={() => {
                          const filteredItems = [];
                          for (let i = 0; i < showTime.length; i++) {
                            if (item !== showTime[i]) {
                              filteredItems.push(showTime[i]);
                            } else {
                            }
                          }

                          setShowTime(filteredItems);
                        }}
                        name="times-circle"
                        size={20}
                        color={'#9a6464'}
                      />
                    </Text>
                  </View>
                </View>
              )}
            ></FlatList>
          </View>
        </View>

        {/* -- 알람 메모 입력 뷰 -- */}
        <View style={styles.viewBox}>
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <Icon name="pencil-alt" size={23} color={'#D6E4E1'} />
            <Text style={styles.seclectText}>메모 작성</Text>
          </View>
          <TextInput
            style={{
              marginTop: 5,
              fontSize: 18,
              width: window.width - 40,
              padding: 5,
              borderWidth: 1,
              borderColor: '#D7E4E1',
              borderStyle: 'solid',
            }}
            placeholder="알람에 메모를 추가하세요!"
            placeholderTextColor={'gray'}
            maxLength={30}
            onChangeText={(alarmMemo) => setAlarmMemo(alarmMemo)}
            defaultValue={alarmMemo}
          />
        </View>

        {/* -- 약 올리기 뷰 -- */}
        <View style={styles.viewBox}>
          <View style={styles.seclectView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="pills" size={22} color={'#D6E4E1'} />
              <Text style={styles.seclectText}>약 올리기</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CameraScreen')}>
              <Text style={{ fontSize: 16 }}>
                사진으로 추가{'  '}
                <Icon name="plus-square" size={20} color={'#6A9C90'} style={{ paddingBottom: 3 }} />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              horizontal={true}
              data={alarmMedicine}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={{
                    margin: 5,
                    alignSelf: 'flex-start',
                    borderWidth: 1,
                    borderColor: '#939393',
                    borderStyle: 'solid',
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {item}
                    <Icon
                      onPress={onPressAlarmMedicinDelete}
                      name="times-circle"
                      size={20}
                      color={'#9a6464'}
                      style={{
                        marginLeft: 5,
                      }}
                    />
                  </Text>
                </View>
              )}
            ></FlatList>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    marginBottom: window.height * 0.01,
    width: window.width - 40,
    height: window.height * 0.15,
    borderBottomWidth: 1,
    borderBottomColor: '#6A9C90',
    borderStyle: 'solid',
  },
  seclectView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  seclectText: {
    paddingLeft: 15,
    fontSize: 18,
  },
});

export default Alarm;
