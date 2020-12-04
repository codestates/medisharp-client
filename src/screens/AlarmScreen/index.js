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

const window = Dimensions.get('window');

const Alarm = () => {
  const weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
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
  const [showTime, setShowTime] = useState([
    moment().format('a') + ' ' + moment().format('hh') + '시' + ' ' + moment().format('mm') + '분',
    '오후 03시 30분',
  ]);
  const [alarmMemo, setAlarmMemo] = useState('');
  const [alarmMedicine, setAlarmMedicine] = useState(['fake1', 'fake2', 'fake3']);
  const [startDateTimePickerShow, setStartDateTimePickerShow] = useState(false);
  const [endDateTimePickerShow, setEndDateTimePickerShow] = useState(false);

  const koreanStandardTime = Date.UTC(startYear, startMonth - 1, startDate);
  const [date, setDate] = useState(new Date(koreanStandardTime));
  const [mode, setMode] = useState('date');

  const onPressStartDate = () => {
    setStartDateTimePickerShow(!startDateTimePickerShow);
  };
  const onPressEndDate = () => {
    setEndDateTimePickerShow(!endDateTimePickerShow);
  };

  const onChangeStartDate = (event, selectedDate) => {
    setStartDateTimePickerShow(!startDateTimePickerShow);
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
    setEndDateTimePickerShow(!endDateTimePickerShow);
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
    //여기는 setSelectedTime 으로 배열에 값 추가해준다음에 뿌려질 수 있게 해줘야할듯
    console.log('Time clicked!');
  };

  const onPressTimeChange = () => {
    console.log('Time clicked!');
  };

  const onPressTimeDelete = () => {
    //여기는 showTime 배열에서 해당 시간값 빼기
    console.log('Time deleted!');
  };

  const onPressAlarmMedicine = () => {
    //여기는 setAlarmMedicine 으로 배열에 값 추가해준다음에 뿌려질 수 있게 해줘야할듯
    console.log('AlarmMedicine clicked!');
  };

  const onPressAlarmMedicinDelete = () => {
    //여기는 alarmMedicine 배열에서 해당 시간값 빼기
    console.log('AlarmMedicine deleted!');
  };

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
            {startDateTimePickerShow && (
              <DateTimePicker
                value={date}
                mode={mode}
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
            {endDateTimePickerShow && (
              <DateTimePicker
                value={date}
                mode={mode}
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

            <TouchableOpacity onPress={onPressTime}>
              <Text style={styles.seclectText}>시간 추가</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <FlatList
              data={showTime}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <TouchableOpacity onPress={onPressTimeChange}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 18, textAlign: 'right', marginRight: 5 }}>
                        {item}
                        <Icon
                          onPress={onPressTimeDelete}
                          name="times-circle"
                          size={20}
                          color={'#9a6464'}
                          style={{ marginLeft: 5 }}
                        />
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          </View>
        </View>

        {/* -- 알람 메모 입력 뷰 -- */}
        <View style={styles.viewBox}>
          <View
            style={{
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <Icon name="pencil-alt" size={23} color={'#D6E4E1'} />
              <Text style={styles.seclectText}>메모 작성</Text>
            </View>
            <TextInput
              style={{
                marginTop: 10,
                marginBottom: 10,
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
        </View>

        {/* -- 약 올리기 뷰 -- */}
        <View style={styles.viewBox}>
          <View style={styles.seclectView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="pills" size={22} color={'#D6E4E1'} />
              <Text style={styles.seclectText}>약 올리기</Text>
            </View>

            <TouchableOpacity onPress={onPressAlarmMedicine}>
              <Icon name="plus-square" size={20} color={'#6A9C90'} style={{ paddingBottom: 3 }} />
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              horizontal={true}
              data={alarmMedicine}
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
    marginBottom: 10,
    width: window.width - 40,
    paddingBottom: 5,
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
