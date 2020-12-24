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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onChange } from 'react-native-reanimated';
import CameraScreen from '../CameraScreen';
import CameraNoticeScreen from '../CameraNoticeScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import { NavigationEvents } from 'react-navigation';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class AlarmScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      alarmMedicine: [],
      weekName: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      nowHour: moment().format().substring(11, 13) + 12,
      nowMinute: moment().format().substring(14, 16),
      alarmTitle: '',
      alarmDate: moment().format().substring(0, 10),
      startYear: moment().format().substring(0, 4),
      startMonth: moment().format().substring(5, 7),
      startDate: moment().format().substring(8, 10),
      startDay: moment().format('dddd'),
      endYear: moment().format().substring(0, 4),
      endMonth: moment().format().substring(5, 7),
      endDate: moment().format().substring(8, 10),
      endDay: moment().format('dddd'),
      alarmInterval: 0,
      showTime: [],
      alarmMemo: '',
      startDatePickerShow: false,
      endDatePickerShow: false,
      timePickerShow: false,
      selectedHour: '13',
      selectedMinute: '00',
      koreanStandardTime: Date.UTC(
        this.startYear,
        this.startMonth - 1,
        this.startDate,
        this.nowHour,
        this.nowMinute,
        0,
      ),
      date: new Date(this.koreanStandardTime),
      token: '',
      medi_ids: [],
      schedules_common_id: null,
      pushArr: [],
      mediupload: false,
      schedulescomupload: false,
    };
  }

  screenDidFocus() {
    // navigation.push('Alarm') 을 통해 stack을 열게되면 기존의 param들이 모두 날아가버리기때문에
    // 로컬에 저장해둔 약이름들을 불러오는 것으로 변경하는 것에대해 고려중임 => 네비게이션 구조를 변경하여 해결
    const alarmMedicineGetParam = this.props.navigation.getParam('alarmMedicine');
    console.log('alarmMedicineGetParam === undefined  =>', alarmMedicineGetParam === undefined);

    alarmMedicineGetParam === undefined
      ? this.state.alarmMedicine
      : this.setState({ alarmMedicine: [alarmMedicineGetParam] });
  }

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

  get_token = async () => {
    const token = await getItem();
    this.setState({ token: token });
    console.log(token);
  };

  postMedi = () => {
    if (this.state.mediupload === false) {
      return axios
        .post(
          'https://hj-medisharp.herokuapp.com/medicines',
          { medicine: this.state.alarmMedicine },
          {
            headers: {
              Authorization: this.state.token,
            },
          },
        )
        .then((res) => {
          this.setState({ mediupload: true, medi_ids: res.data['medicine_id'] });
          console.log('약등록 성공', this.state.mediupload);
          console.log('약등록 성공', this.state.medi_ids);
        })
        .catch((e) => {
          console.log('error postmedi');
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: async () => {
                  await this.postMedi();
                  await this.postMeSceUsId();
                },
              },
            ],
            { cancelable: false },
          );
        });
    }
  };

  postScheduleCommon = () => {
    if (this.state.schedulescomupload === false) {
      return axios
        .post(
          'https://hj-medisharp.herokuapp.com/schedules-commons',
          {
            schedules_common: {
              title: this.state.alarmTitle,
              memo: this.state.alarmMemo,
              startdate: `${this.state.startYear}-${this.state.startMonth}-${this.state.startDate}`,
              enddate: `${this.state.endYear}-${this.state.endMonth}-${this.state.endDate}`,
              cycle: this.state.alarmInterval,
            },
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          },
        )
        .then((res) => {
          this.setState({
            schedulescomupload: true,
            schedules_common_id: res.data.results['new_schedules_common_id'],
          });
          console.log('스케줄등록 성공', this.state.schedulescomupload);
          console.log('스케줄등록 성공', this.state.schedules_common_id);
        })
        .catch((e) => {
          console.log('error schedules common');
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: async () => {
                  await this.postScheduleCommon();
                  await this.postScheduleDate();
                  await this.postMeSceUsId();
                },
              },
            ],
            { cancelable: false },
          );
        });
    }
  };

  postMediSchedId = () => {
    return axios
      .post(
        'https://hj-medisharp.herokuapp.com/medicines/schedules-medicines',
        {
          schedules_common_medicines: {
            medicines_id: this.state.medi_ids,
            schedules_common_id: Number(this.state.schedules_common_id),
          },
        },
        {
          headers: {
            Authorization: this.state.token,
          },
        },
      )
      .catch((e) => {
        console.log('error postMediSchedId');
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.postMediSchedId(),
            },
          ],
          { cancelable: false },
        );
      });
  };

  postMediUId = () => {
    return axios
      .post(
        'https://hj-medisharp.herokuapp.com/medicines/users-medicines',
        {
          medicines: {
            medicines_id: this.state.medi_ids,
          },
        },
        {
          headers: {
            Authorization: this.state.token,
          },
        },
      )
      .catch((e) => {
        console.log('error postMediUId');
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.postMediUId(),
            },
          ],
          { cancelable: false },
        );
      });
  };

  postMediSchedules = () => {
    return axios.all([this.postMedi(), this.postScheduleCommon()]).then(
      axios.spread(async (medires, schedulesres) => {
        // await this.setState({
        //   medi_ids: medires.data['medicine_id'],
        //   schedules_common_id: schedulesres.data.results['new_schedules_common_id'],
        // });
      }),
    );
  };

  postScheduleDate = () => {
    if (this.state.schedulescomupload === true && this.state.pushArr !== []) {
      return axios
        .post(
          'https://hj-medisharp.herokuapp.com/schedules-commons/schedules-dates',
          {
            schedules_common: {
              schedules_common_id: Number(this.state.schedules_common_id),
              time: `${this.state.selectedHour}:${this.state.selectedMinute}`,
              startdate: `${this.state.startYear}-${this.state.startMonth}-${this.state.startDate}`,
              enddate: `${this.state.endYear}-${this.state.endMonth}-${this.state.endDate}`,
              cycle: Number(this.state.alarmInterval),
              pushArr: this.state.pushArr,
            },
          },
          {
            headers: {
              Authorization: this.state.token,
            },
          },
        )
        .catch((e) => {
          console.log('error postScheduleDate');
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: () => this.postScheduleDate(),
              },
            ],
            { cancelable: false },
          );
        });
    }
  };

  postMeSceUsId = async () => {
    if (this.state.mediupload === true && this.state.schedulescomupload === true) {
      return axios.all([this.postMediSchedId(), this.postMediUId()]).then(async () => {
        await this.setState({
          alarmTitle: '',
          alarmMemo: '',
          startYear: moment().format().substring(0, 4),
          startMonth: moment().format().substring(5, 7),
          startDate: moment().format().substring(8, 10),
          startDay: moment().format('dddd'),
          endYear: moment().format().substring(0, 4),
          endMonth: moment().format().substring(5, 7),
          endDate: moment().format().substring(8, 10),
          endDay: moment().format('dddd'),
          showTime: [],
          alarmInterval: 0,
          selectedHour: '',
          selectedMinute: '',
          alarmMedicine: [],
        });
        await this.props.navigation.navigate('Calendar');
      });
    } else if (this.state.mediupload === false && this.state.schedulescomupload === true) {
      await this.postMedi();
      await this.postMeSceUsId();
    } else if (this.state.mediupload === true && this.state.schedulescomupload === false) {
      await this.postScheduleCommon();
      await this.postScheduleDate();
      await this.postMeSceUsId;
    } else if (this.state.mediupload === false && this.state.schedulescomupload === false) {
      this.postSchedules();
    }
  };

  postSchedules = async () => {
    await this.get_token();
    await this.postMediSchedules();
    await this.postScheduleDate();
    await this.postMeSceUsId();
  };

  postPush = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('medi', {
        name: 'medi',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      let startD = moment(
        `${this.state.startYear}-${this.state.startMonth}-${this.state.startDate}`,
      ).toDate();
      let endD = moment(
        `${this.state.endYear}-${this.state.endMonth}-${this.state.endDate}`,
      ).toDate();
      let curr = startD;
      let pushArr = [];
      console.log(curr);
      while (curr <= endD) {
        let trigger = new Date(curr);
        trigger.setHours(Number(this.state.selectedHour));
        trigger.setMinutes(Number(this.state.selectedMinute));
        trigger.setSeconds(0);
        console.log('trigger:', trigger);
        const pushSched = await Notifications.scheduleNotificationAsync({
          content: {
            title: `약 챙겨먹을 시간입니다~!!!💊`,
            body: `등록하신 ${this.state.alarmMemo} 일정이에요!`,
            sound: 'email-sound.wav', // <- for Android below 8.0
          },
          trigger,
        });
        pushArr.push(pushSched);
        curr = moment(curr).add(Number(this.state.alarmInterval), 'd').toDate();
      }
      await this.setState({ pushArr: pushArr });
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: getStatusBarHeight(),
          height: window.height * 0.92 - 1,
          paddingLeft: 20,
        }}
      >
        <NavigationEvents
          onDidFocus={(payload) => {
            const resultArr = this.state.alarmMedicine;
            let alarmMedicineGetParam = this.props.navigation.getParam('alarmMedicine');
            alarmMedicineGetParam === undefined
              ? this.state.alarmMedicine
              : resultArr.push(alarmMedicineGetParam);
            this.setState({ alarmMedicine: resultArr });
            console.log('alarmMedicine  =>', this.state.alarmMedicine);
            console.log('resultArr  =>', resultArr);
          }}
        />
        <Text
          style={{
            marginTop: 30,
            fontSize: 24,
            fontWeight: '300',
          }}
        >
          약 올리기
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
            복용 알람 등록하기
          </Text>
        </View>
        <ScrollView>
          {/* -- 약 올리기 뷰 -- */}
          <View style={styles.viewBox}>
            <View style={styles.seclectView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="pills" size={22} color={'#D6E4E1'} />
                <Text style={styles.seclectText}>약 올리기</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('CameraNoticeScreen', {
                    update: '',
                    item: '',
                    clickedDate: '',
                  })
                }
              >
                <Text style={{ fontSize: 16 }}>
                  사진으로 추가 <Icon name="plus-square" size={16} color={'#6A9C90'} />
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                horizontal={true}
                data={this.state.alarmMedicine}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        alignSelf: 'flex-start',
                        borderWidth: 1,
                        borderColor: '#939393',
                        borderStyle: 'solid',
                        borderRadius: 5,
                        padding: 5,
                      }}
                    >
                      <Text style={{ fontSize: 18, marginRight: 5 }}>
                        {item.name}
                        {'  '}
                        <Icon
                          onPress={() => {
                            const filteredMedicine = [];
                            for (let i = 0; i < this.state.alarmMedicine.length; i++) {
                              console.log(
                                'this.state.alarmMedicine[i] =>',
                                this.state.alarmMedicine[i],
                              );
                              console.log('item =>', item);
                              if (item['name'] !== this.state.alarmMedicine[i]['name']) {
                                filteredMedicine.push(this.state.alarmMedicine[i]);
                              } else {
                              }
                            }

                            this.setState({ alarmMedicine: filteredMedicine });
                          }}
                          name="times-circle"
                          size={20}
                          color={'#9a6464'}
                          style={{
                            marginLeft: 5,
                          }}
                        />
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
            <TextInput
              style={{
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 5,
                fontSize: 20,
                width: window.width - 40,
                paddingBottom: 5,
              }}
              placeholder="알람 이름을 입력하세요 :)"
              placeholderTextColor={'gray'}
              maxLength={10}
              onChangeText={(alarmTitleValue) => this.setState({ alarmTitle: alarmTitleValue })}
              defaultValue={this.state.alarmTitle}
            />
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
              placeholder="알람에 메모를 추가하세요!"
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

          {/* -- 확인 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20, marginLeft: -20 }}>
            <TouchableOpacity
              onPress={async () => {
                await this.postPush();
                await this.postSchedules();
              }}
            >
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
                <Text style={{ fontSize: 20, color: 'white' }}>등록하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
