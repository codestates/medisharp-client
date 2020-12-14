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
import { NavigationEvents } from 'react-navigation';
import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class AlarmUpdateScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      item: [this.props.navigation.getParam('item')],
      medicineName: [],
      alarmMemo: [],
      startDatePickerShow: false,
      endDatePickerShow: false,
      timePickerShow: false,
      weekName: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      startMonth: '12',
      startDate: '01',
      startDay: '',
      endMonth: '12',
      endDate: '15',
      endDay: '',
      date: new Date(this.koreanStandardTime),
      showTime: [],
      check: false,
    };
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/schedules-commons',
        headers: {
          Authorization: token,
        },
        params: this.state.item[0],
      })
        .then((data) => {
          axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/medicines',
            headers: {
              Authorization: token,
            },
            params: {
              schedules_common_id: data.data.results[0]['schedules_common_id'],
            },
          })
            .then((data) => {
              let medicineList = data.data.results.map((el) => el.name);
              this.setState({ medicineName: medicineList });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  checkChangeTrue = () => {
    this.setState({ check: true });
  };

  checkChangeFalse = () => {
    this.setState({ check: false });
  };

  onPressStartDate = () => {
    this.setState({ startDatePickerShow: !this.state.startDatePickerShow });
  };
  onPressEndDate = () => {
    this.setState({ endDatePickerShow: !this.state.endDatePickerShow });
  };

  onChangeStartDate = (event, selectedDate) => {
    this.setState({ startDatePickerShow: !this.state.startDatePickerShow });
    const startDate = selectedDate || this.state.date;

    this.setState({ date: startDate });

    const startDateToShowYear = startDate.getFullYear();
    const startDateToShowMonth = startDate.getMonth();
    const startDateToShowDate = startDate.getDate();
    const startDateToShowDay = this.state.weekName[startDate.getDay()];

    this.setState({ startYear: startDateToShowYear });
    this.setState({ startMonth: startDateToShowMonth + 1 });
    this.setState({ startDate: startDateToShowDate });
    this.setState({ startDay: startDateToShowDay });
  };

  onChangeEndDate = (event, selectedDate) => {
    this.setState({ endDatePickerShow: !this.state.endDatePickerShow });
    const endDate = selectedDate || this.state.date;
    this.setState({ date: endDate });

    const endDateToShowYear = endDate.getFullYear();
    const endDateToShowMonth = endDate.getMonth();
    const endDateToShowDate = endDate.getDate();
    const endDateToShowDay = this.state.weekName[endDate.getDay()];

    this.setState({ endYear: endDateToShowYear });
    this.setState({ endMonth: endDateToShowMonth + 1 });
    this.setState({ endDate: endDateToShowDate });
    this.setState({ endDay: endDateToShowDay });
  };

  onPressTime = () => {
    this.setState({ timePickerShow: !this.state.timePickerShow });
  };

  onChangeTime = (event, selectedTime) => {
    this.setState({ timePickerShow: !this.state.timePickerShow });

    const selectedHourInPicker = selectedTime.toString().substring(16, 18);
    const selectedMinuteInPicker = selectedTime.toString().substring(19, 21);

    this.setState({ selectedHour: selectedHourInPicker });
    this.setState({ selectedMinute: selectedMinuteInPicker });

    this.setState({
      showTime: [selectedHourInPicker + '시' + ' ' + selectedMinuteInPicker + '분'],
    });
  };

  render() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <NavigationEvents
          onDidFocus={(payload) => {
            const startDayValue = new Date('2020-12-01').getDay();
            const endDayValue = new Date('2020-12-15').getDay();
            this.setState({ startDay: this.state.weekName[startDayValue] });
            this.setState({ endDay: this.state.weekName[endDayValue] });
          }}
        />
        <ScrollView
          style={{
            marginTop: 30,
            backgroundColor: 'white',
            paddingLeft: 20,
            height: window.height * 0.92 - 30,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: '300',
            }}
          >
            알람 수정
          </Text>
          <View
            style={{
              borderBottomStyle: 'solid',
              borderBottomWidth: 5,
              borderBottomColor: '#6a9c90',
              alignSelf: 'flex-start',
              marginBottom: window.height * 0.02,
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
              복용 알람 수정하기
            </Text>
          </View>

          {/* -- 상단 복용 여부 버튼 -- */}
          <View
            style={{
              width: window.width - 40,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 20,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                onPress={this.checkChangeTrue}
                style={this.state.check ? styles.TrueBoxCheckTrue : styles.TrueBoxCheckFalse}
              >
                <Text
                  style={
                    this.state.check
                      ? { fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }
                      : {
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: '#6a9c90',
                          textAlign: 'center',
                        }
                  }
                >
                  먹었어요!
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.checkChangeFalse}
                style={this.state.check ? styles.FalseBoxCheckFalse : styles.FalseBoxCheckTrue}
              >
                <Text
                  style={
                    this.state.check
                      ? {
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: '#9a6464',
                          textAlign: 'center',
                        }
                      : {
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center',
                        }
                  }
                >
                  아직이요!
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* -- 약 올리기 뷰 -- */}
          <View style={styles.viewBox}>
            <View style={styles.seclectView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="pills" size={22} color={'#D6E4E1'} />
                <Text style={styles.seclectText}>약 올리기</Text>
              </View>
            </View>
            <View>
              <FlatList
                horizontal={true}
                data={this.state.medicineName}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        alignSelf: 'flex-start',
                        borderWidth: 2,
                        borderColor: '#6a9c90',
                        borderStyle: 'solid',
                        borderRadius: 5,
                        padding: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#6a9c90',
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  </View>
                )}
              ></FlatList>
            </View>
          </View>

          {/* -- 알람 이름 입력 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <Icon name="pencil-alt" size={23} color={'#D6E4E1'} />
              <Text style={styles.seclectText}>알람 이름</Text>
            </View>

            <Text
              style={{
                textAlign: 'center',
                marginTop: -10,
                marginBottom: 5,
                fontSize: 20,
                width: window.width - 40,
                paddingBottom: 5,
                color: '#6a9c90',
              }}
            >
              {this.state.item[0]['title']}
            </Text>
          </View>

          {/* -- 알람 메모 입력 뷰 -- */}
          <View style={styles.viewBox}>
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <Icon name="pencil-alt" size={23} color={'#D6E4E1'} />
              <Text style={styles.seclectText}>메모 작성</Text>
            </View>
            <TextInput
              style={{
                textAlign: 'left',
                marginBottom: window.height * 0.015,
                marginTop: 5,
                fontSize: 18,
                width: window.width - 40,
                padding: 5,
                borderWidth: 1,
                borderColor: '#D7E4E1',
                borderStyle: 'solid',
              }}
              placeholder={this.state.item[0]['memo']}
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(alarmMemoValue) => this.setState({ alarmMemo: alarmMemoValue })}
              defaultValue={this.state.alarmMemo}
            />
          </View>

          {/* -- 날짜 선택 뷰 -- */}
          <View style={styles.viewBox}>
            <View style={styles.seclectView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="calendar-alt" size={25} color={'#D6E4E1'} />
                <Text style={styles.seclectText}>시작 날짜</Text>
              </View>
              {this.state.startDatePickerShow && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={this.onChangeStartDate}
                />
              )}
              <TouchableOpacity onPress={this.onPressStartDate}>
                <Text
                  style={{
                    paddingLeft: 15,
                    fontSize: 18,
                  }}
                >
                  {this.state.startMonth}월 {this.state.startDate}일 {this.state.startDay}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.seclectView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="calendar-alt" size={25} color={'transparent'} />
                <Text style={styles.seclectText}>종료 날짜</Text>
              </View>
              {this.state.endDatePickerShow && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={this.onChangeEndDate}
                />
              )}
              <TouchableOpacity onPress={this.onPressEndDate}>
                <Text
                  style={{
                    paddingLeft: 15,
                    fontSize: 18,
                  }}
                >
                  {this.state.endMonth}월 {this.state.endDate}일 {this.state.endDay}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* -- 시간 선택 뷰 -- */}
          <View style={styles.viewBox}>
            <View style={styles.seclectView}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Icon name="clock" size={24} color={'#D6E4E1'} />
                  <Text style={styles.seclectText}>시간 설정</Text>
                </View>
                {this.state.timePickerShow && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="spinner"
                    onChange={this.onChangeTime}
                  />
                )}
                <TouchableOpacity onPress={this.onPressTime}>
                  <Text style={{ fontSize: 16 }}>
                    시간 추가 <Icon name="plus-square" size={16} color={'#6A9C90'} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#6a9c90', fontWeight: 'bold', margin: 10 }}>
                시간은 한 알람에 하나씩만 추가할 수 있어요!
              </Text>
            </View>
            <View>
              <FlatList
                data={this.state.showTime}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        alignSelf: 'center',
                        borderWidth: 1,
                        borderColor: '#939393',
                        borderStyle: 'solid',
                        borderRadius: 5,
                        padding: 5,
                      }}
                    >
                      <Text style={{ fontSize: 22, textAlign: 'right', marginRight: 5 }}>
                        {item}
                        {'  '}
                        <Icon
                          onPress={() => {
                            this.setState({ showTime: [] });
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

              {/* -- 반복 주기 -- */}
              <View style={styles.seclectView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Icon name="clock" size={24} color={'white'} />
                    <Text style={styles.seclectText}>반복 주기</Text>
                  </View>
                  <TextInput
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                    }}
                    placeholder="0"
                    placeholderTextColor={'gray'}
                    maxLength={2}
                    onChangeText={(alarmInterval) =>
                      this.setState({ alarmInterval: alarmInterval })
                    }
                    defaultValue={this.state.alarmInterval}
                  />
                  <Text style={{ fontSize: 16 }}>일 간격</Text>
                </View>
              </View>
            </View>
          </View>

          {/* -- 하단 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20, marginLeft: -20 }}>
            <TouchableOpacity onPress={() => console.log('수정하기 눌려따!')}>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#6a9c90',
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>수정하기</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('삭제하기 눌려따!')}>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#9a6464',
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>삭제하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  TrueBoxCheckTrue: {
    marginTop: 10,
    width: window.width * 0.42,
    height: window.width * 0.42,
    backgroundColor: '#6a9c90',
    borderRadius: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  TrueBoxCheckFalse: {
    marginTop: 10,
    width: window.width * 0.42,
    height: window.width * 0.42,
    borderColor: '#6a9c90',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  FalseBoxCheckTrue: {
    marginTop: 10,
    width: window.width * 0.42,
    height: window.width * 0.42,
    backgroundColor: '#9a6464',
    borderRadius: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  FalseBoxCheckFalse: {
    marginTop: 10,
    width: window.width * 0.42,
    height: window.width * 0.42,
    borderColor: '#9a6464',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  viewBox: {
    marginBottom: window.height * 0.005,
    width: window.width - 40,
    borderBottomWidth: 1,
    borderBottomColor: '#6A9C90',
    borderStyle: 'solid',
  },
  seclectView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  seclectText: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
