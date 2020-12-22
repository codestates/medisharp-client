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

import { getStatusBarHeight } from 'react-native-status-bar-height';

const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class AlarmUpdateScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('item'),
      clickedDate: this.props.navigation.getParam('clickedDate'),
      medicines: [],
      alarmMemo: '',
      startDatePickerShow: false,
      endDatePickerShow: false,
      timePickerShow: false,
      weekName: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      totalStartDate: '',
      totalEndDate: '',
      startYear: '',
      startMonth: '',
      startDate: '',
      startDay: '',
      endYear: '',
      endMonth: '',
      endDate: '',
      endDay: '',
      selectedHour: '',
      selectedMinute: '',
      date: new Date(this.koreanStandardTime),
      showTime: [],
      check: this.props.navigation.getParam('item')[0]['check'],
      alarmInterval: 0,
      schedules_common_id: null,
    };
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: 'https://hj-medisharp.herokuapp.com/schedules-commons',
        headers: {
          Authorization: token,
        },
        params: this.state.item[0],
      })
        .then((data) => {
          let startdate = data.data.results[0]['startdate'].split('-');
          let enddate = data.data.results[0]['enddate'].split('-');
          let hour = data.data.results[0]['time'].split(':')[0];
          let minute = data.data.results[0]['time'].split(':')[1];
          this.setState({
            totalStartDate: data.data.results[0]['startdate'],
            totalEndDate: data.data.results[0]['enddate'],
            startYear: startdate[0],
            startMonth: startdate[1],
            startDate: startdate[2],
            endYear: enddate[0],
            endMonth: enddate[1],
            endDate: enddate[2],
            alarmInterval: data.data.results[0]['cycle'],
            selectedHour: hour,
            selectedMinute: minute,
            showTime: [data.data.results[0]['time']],
            schedules_common_id: data.data.results[0]['schedules_common_id'],
            alarmMemo: data.data.results[0]['memo'],
          });

          axios({
            method: 'get',
            url: 'https://hj-medisharp.herokuapp.com/medicines',
            headers: {
              Authorization: token,
            },
            params: {
              schedules_common_id: this.state.schedules_common_id,
            },
          })
            .then((data) => {
              console.log('medi:', data.data.results);
              console.log('schedules_common_id:', this.state.schedules_common_id);
              //let medicineList = data.data.results.map((el) => el['name']);
              this.setState({ medicines: data.data.results });
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

  patchSChedules = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios
          .post(
            'https://hj-medisharp.herokuapp.com/medicines',
            { medicine: this.state.medicines },
            {
              headers: {
                Authorization: token,
              },
            },
          )
          .then((res) => {
            let medi_ids = res.data.medicine_id;
            console.log('post medicines API', medi_ids);
            console.log('scid:', this.state.schedules_common_id);
            schedules_common_id = this.state.schedules_common_id;
            axios
              .patch(
                'https://hj-medisharp.herokuapp.com/schedules-commons',
                {
                  schedules_common: {
                    schedules_common_id: schedules_common_id,
                    memo: this.state.alarmMemo,
                    startdate: `${this.state.startYear}-${this.state.startMonth}-${this.state.startDate}`,
                    enddate: `${this.state.endYear}-${this.state.endMonth}-${this.state.endDate}`,
                    cycle: this.state.alarmInterval,
                    time: `${this.state.selectedHour}:${this.state.selectedMinute}`,
                  },
                },
                {
                  headers: {
                    Authorization: token,
                  },
                },
              )
              .then((res) => {
                let time = res.data.results['time'];
                let startdate = res.data.results['startdate'];
                let endtdate = res.data.results['enddate'];
                let cycle = Number(res.data.results['cycle']);
                console.log('schedules common API', schedules_common_id, time, medi_ids);
                console.log('cycle:', cycle, typeof cycle);
                axios
                  .patch(
                    'https://hj-medisharp.herokuapp.com/schedules-commons/schedules-dates',
                    {
                      schedules_common: {
                        medicines_id: medi_ids,
                        schedules_common_id: this.state.schedules_common_id,
                        time: time,
                        startdate: startdate,
                        enddate: endtdate,
                        cycle: cycle,
                      },
                    },
                    {
                      headers: {
                        Authorization: token,
                      },
                    },
                  )
                  .then(() => {
                    console.log('schedules common, schedules date API');
                    axios
                      .post(
                        'https://hj-medisharp.herokuapp.com/medicines/schedules-medicines',
                        {
                          schedules_common_medicines: {
                            medicines_id: medi_ids,
                            schedules_common_id: this.state.schedules_common_id,
                          },
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      )
                      .then(() => {
                        console.log('schedules medicines, medicines API');
                        axios
                          .post(
                            'https://hj-medisharp.herokuapp.com/medicines/users-medicines',
                            {
                              medicines: {
                                medicines_id: medi_ids,
                              },
                            },
                            {
                              headers: {
                                Authorization: token,
                              },
                            },
                          )
                          .then(() => {
                            console.log('medicines, user medicines API');
                            this.props.navigation.navigate('Calendar');
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  patchCheck = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios
        .patch(
          'https://hj-medisharp.herokuapp.com/schedules-dates/check',
          {
            schedules_common: {
              schedules_common_id: this.state.schedules_common_id,
              clickedDate: this.state.clickedDate,
            },
          },
          {
            headers: {
              Authorization: token,
            },
          },
        )
        .then((res) => {
          const changedCheck = res.data.results['check'];
          this.setState({ check: changedCheck });
          console.log('patch check API');
        });
    });
  };

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
      <View
        style={{
          height: window.height * 0.92 - 1,
          backgroundColor: 'white',
          paddingTop: getStatusBarHeight(),
          paddingLeft: 20,
        }}
      >
        <NavigationEvents
          onDidFocus={(payload) => {
            const startDayValue = new Date(this.state.totalStartDate).getDay();
            const endDayValue = new Date(this.state.totalEndDate).getDay();
            this.setState({ startDay: this.state.weekName[startDayValue] });
            this.setState({ endDay: this.state.weekName[endDayValue] });
            const resultArr = this.state.medicines;
            let alarmMedicineGetParam = this.props.navigation.getParam('alarmMedicine');
            alarmMedicineGetParam === undefined
              ? this.state.medicines
              : resultArr.push(alarmMedicineGetParam);
            this.setState({ medicines: resultArr });
            console.log('alarmMedicine  =>', this.state.medicines);
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
        <ScrollView>
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
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('CameraNoticeScreen', {
                      update: true,
                      item: this.state.item,
                      clickedDate: this.state.clickedDate,
                    })
                  }
                >
                  <Text style={{ fontSize: 16 }}>
                    사진으로 추가 <Icon name="plus-square" size={16} color={'#6A9C90'} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <FlatList
                horizontal={true}
                data={this.state.medicines}
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
                            for (let i = 0; i < this.state.medicines.length; i++) {
                              console.log('this.state.medicines[i] =>', this.state.medicines[i]);
                              console.log('item =>', item);
                              if (item !== this.state.medicines[i]) {
                                filteredMedicine.push(this.state.medicines[i]);
                              } else {
                              }
                            }

                            this.setState({ medicines: filteredMedicine });
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
                        {''}
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
            <TouchableOpacity onPress={this.patchSChedules}>
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

            {/* -- 삭제하기 분기페이지로 슝! -- */}
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('DeleteCheck', {
                  schedules_common_id: this.state.schedules_common_id,
                  clickedDate: this.state.clickedDate,
                });
              }}
            >
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
