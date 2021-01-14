import React from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

export default class FindPw extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phoneNumber: '',
      useremail: '',
      isAvailedName: '',
      isAvailedPhoneNumber: '',
      isAvailedEmail: '',
    };
  }

  handleSignUpValue = (key, value) => {
    if (key === 'name') {
      var namereg = /^[가-힣]+$/;
      var name = value;
      if (name.length > 0 && false === namereg.test(name)) {
        this.setState({
          isAvailedName: '올바른 이름 형식이 아닙니다.',
        });
      } else {
        this.setState({ isAvailedName: '' });
        this.setState({ name: value });
      }
    }
    if (key === 'phoneNumber') {
      var phoneNumberreg = /^[0-9]+$/;
      var phoneNumber = value;
      if (phoneNumber.length > 0 && false === phoneNumberreg.test(phoneNumber)) {
        this.setState({
          isAvailedPhoneNumber: '공백없이 숫자만 입력하세요.',
        });
      } else {
        this.setState({ isAvailedPhoneNumber: '' });
        this.setState({ phoneNumber: value });
      }
    }
    if (key === 'useremail') {
      var emailreg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      var useremail = value;
      this.setState({ useremail: useremail });
      var check = emailreg.test(useremail);
      if (useremail.length > 0 && check === false) {
        this.setState({ isAvailedEmail: '올바른 이메일 형식이 아닙니다.' });
      } else {
        this.setState({ isAvailedEmail: '' });
      }
    }
  };

  onFindPw() {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/users/id',
      params: {
        email: this.state.useremail,
      },
    })
      .then((data) => {
        console.log(data.data.results);
        let res_edit = data.data.results;
        axios
          .patch('http://127.0.0.1:5000/users/password', {
            users: {
              id: res_edit['id'],
              password: res_edit['password'],
            },
          })
          .then((res) => {
            console.log(res.data);
            Alert.alert(
              '임시 비밀번호가 등록된 메일로 발송되었습니다.',
              '로그인 후 비밀번호를 변경해주세요.',
              [
                {
                  text: '다시 발급받기',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: '로그인하러가기',
                  onPress: () => this.props.navigation.navigate('LoginScreen'),
                },
              ],
              { cancelable: false },
            );
          })
          .catch((e) => {
            console.log(e);
            Alert.alert(
              '에러가 발생했습니다!',
              '다시 시도해주세요',
              [
                {
                  text: '다시시도하기',
                  onPress: () => this.onFindPw(),
                },
              ],
              { cancelable: false },
            );
          });
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.onFindPw(),
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
          backgroundColor: 'white',
          paddingTop: getStatusBarHeight() + verticalMargin,
          height: window.height,
        }}
      >
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
            약 올림
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
            비밀번호 찾기
          </Text>
        </View>
        <ScrollView style={{ paddingLeft: 20 }}>
          {/* -- 이름 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>이름</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="이름을 입력하세요."
              placeholderTextColor={'#c4c4c4'}
              maxLength={12}
              onChangeText={(nameValue) => this.handleSignUpValue('name', nameValue)}
              defaultValue={this.state.name}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedName}</Text>

          {/* -- 전화번호 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>전화번호</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="가입시 등록한 번호를 입력하세요."
              placeholderTextColor={'#c4c4c4'}
              maxLength={11}
              onChangeText={(phoneNumberValue) =>
                this.handleSignUpValue('phoneNumber', phoneNumberValue)
              }
              defaultValue={this.state.phone}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedPhoneNumber}</Text>

          {/* -- 이메일 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>이메일 주소</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="가입시 등록한 메일을 입력하세요"
              placeholderTextColor={'#c4c4c4'}
              maxLength={30}
              onChangeText={(useremailValue) => this.handleSignUpValue('useremail', useremailValue)}
              defaultValue={this.state.eMail}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedEmail}</Text>

          {/* -- 확인 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: -10, marginBottom: 30, marginLeft: -20 }}>
            <TouchableOpacity
              onPress={() => {
                this.onFindPw();
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#76a991',
                  borderRadius: 100,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>비밀번호 찾기</Text>
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
  },
  textInputTitle: {
    paddingLeft: 10,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: '200',
    color: '#76a991',
  },
  placeholderText: {
    fontSize: 16,
    width: window.width - 40,
    paddingLeft: 10,
  },
  nonAvailableText: {
    marginTop: -verticalMargin,
    marginBottom: verticalMargin,
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffaaaa',
  },
});
