import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useAsyncStorage } from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

export default class CheckScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      uri: this.props.navigation.getParam('uri'),
      form_data: this.props.navigation.getParam('form_data'),
      getImg: '../../img/loginMain.png',
      medicineName: '',
      effect: '',
      capacity: '',
      validity: '',
      imgS3Uri: null,
      update: this.props.navigation.getParam('update'),
      item: this.props.navigation.getParam('item'),
      clickedDate: this.props.navigation.getParam('clickedDate'),
    };
  }

  async componentDidMount() {
    const getImg = await FileSystem.getInfoAsync(this.state.uri);
    console.log(getImg['uri']);
    this.setState({ getImg: getImg['uri'] });
  }

  redirectToAlarmScreen() {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios
          .post('http://127.0.0.1:5000/medicines/upload', this.state.form_data, {
            headers: {
              'content-type': 'multipart/form-data',
              Authorization: token,
            },
          })
          .then((res) => {
            console.log(res.data.results);
            this.setState({
              imgS3Uri: res.data.results,
            });
          })
          .then(() => {
            if (this.state.update === true) {
              this.props.navigation.navigate('AlarmUpdateScreen', {
                alarmMedicine: {
                  name: this.state.medicineName,
                  image_dir: this.state.imgS3Uri,
                  camera: false,
                  title: null,
                  effect: this.state.effect,
                  capacity: this.state.capacity,
                  validity: this.state.validity,
                },
                item: this.state.item,
                clickedDate: this.state.clickedDate,
              });
            } else {
              this.props.navigation.navigate('Alarm', {
                alarmMedicine: {
                  name: this.state.medicineName,
                  image_dir: this.state.imgS3Uri,
                  camera: false,
                  title: null,
                  effect: this.state.effect,
                  capacity: this.state.capacity,
                  validity: this.state.validity,
                },
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Alert.alert(
              '에러가 발생했습니다!',
              '다시 시도해주세요',
              [
                {
                  text: '다시시도하기',
                  onPress: () => this.redirectToAlarmScreen(),
                },
              ],
              { cancelable: false },
            );
          });
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.redirectToAlarmScreen(),
            },
          ],
          { cancelable: false },
        );
      });
  }

  render() {
    return (
      <View
        style={{
          height: window.height * 0.9,
          width: window.width - 40,
          marginLeft: 20,
          alignItems: 'center',
          paddingTop: verticalMargin * 3,
        }}
      >
        <Image
          style={{
            width: window.width - 40,
            height: window.width - 40,
            borderRadius: 50,
          }}
          source={{ uri: this.state.getImg }}
        />

        <Text
          style={{
            fontSize: 20,
            color: '#313131',
            fontWeight: 'bold',
            marginTop: '5%',
            textAlign: 'center',
          }}
        >
          직접 입력하기
        </Text>

        <ScrollView
          style={{
            height: window.height * 0.8,
            marginTop: verticalMargin,
          }}
        >
          {/* -- 약 이름 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>약 이름</Text>

            <TextInput
              style={styles.textInputStyle}
              placeholder="약 이름을 입력하세요 :)"
              placeholderTextColor={'gray'}
              maxLength={10}
              onChangeText={(medicineNameValue) =>
                this.setState({ medicineName: medicineNameValue })
              }
              defaultValue={this.state.medicineName}
            />
          </View>

          {/* -- 효능/효과 메모 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>효능/효과</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="효능/효과을 입력하세요!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(effectValue) => this.setState({ effect: effectValue })}
              defaultValue={this.state.effect}
            />
          </View>

          {/* -- 용법/용량 메모 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>용법/용량</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="용법/용량을 입력하세요!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(capacityValue) => this.setState({ capacity: capacityValue })}
              defaultValue={this.state.capacity}
            />
          </View>

          {/* -- 유효기간 메모 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>유효기간</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="유효기간을 입력하세요!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(validityValue) => this.setState({ validity: validityValue })}
              defaultValue={this.state.validity}
            />
          </View>

          {/* -- 확인 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => {
                this.redirectToAlarmScreen();
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#76a991',
                  borderRadius: window.height * 0.075,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>이걸로 결정!</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputBox: {
    marginBottom: verticalMargin,
    borderBottomWidth: 1,
    borderBottomColor: '#76a991',
    borderStyle: 'solid',
    width: window.width - 40,
    paddingBottom: window.height * 0.015,
  },
  textInputTitle: {
    fontSize: 18,
    fontWeight: '200',
    color: '#626262',
    paddingLeft: 5,
  },
  textInputStyle: {
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    fontSize: 16,
    width: window.width - 60,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
  },
});
