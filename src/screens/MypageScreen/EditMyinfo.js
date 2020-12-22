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
import { NavigationEvents } from 'react-navigation';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.getParam('name'),
      phoneNumber: '', //client에서 가지고 있으면 안되고 매번 API를 통해 검사해줘야 하는 것
      useremail: this.props.navigation.getParam('useremail'), //just for rendering
      password: '', //client에서 가지고 있으면 안되고 매번 API를 통해 검사해줘야 하는 것
      passwordCheck: '',
      isAvailedName: '',
      isAvailedPhoneNumber: '',
      isAvailedEmail: '',
      isAvailedPassword: '',
      isAvailedPasswordCheck: '',
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
    if (key === 'password') {
      var reg = /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
      var password = value;
      if (password.length > 0 && false === reg.test(password)) {
        this.setState({
          isAvailedPassword: '비밀번호는 8~16자이어야 하며, 숫자/소문자를 모두 포함해야 합니다.',
        });
      } else {
        this.setState({ isAvailedPassword: '' });
        this.setState({ password: value });
      }
    }
    if (key === 'passwordCheck') {
      var passwordCheck = value;
      if (passwordCheck.length > 0 && this.state.password !== passwordCheck) {
        this.setState({ isAvailedPasswordCheck: '비밀번호가 일치하지 않습니다.' });
      } else {
        this.setState({ isAvailedPasswordCheck: '' });
        this.setState({ passwordCheck: value });
      }
    }
  };

  editUserInfo = () => {
    if (
      this.state.isAvailedName === '' &&
      this.state.isAvailedPhoneNumber === '' &&
      this.state.isAvailedEmail === '' &&
      this.state.isAvailedPassword === '' &&
      this.state.isAvailedPasswordCheck === ''
    ) {
      async function get_token() {
        const token = await getItem();
        return token;
      }
      get_token()
        .then((token) => {
          console.log(
            '수정할 데이터: ',
            this.state.phoneNumber,
            this.state.name,
            this.state.password,
          );
          axios({
            method: 'patch',
            url: 'http://127.0.0.1:5000/users', //'http://127.0.0.1:5000/users',
            headers: {
              Authorization: token,
            },
            data: {
              users: {
                mobile: this.state.phoneNumber,
                full_name: this.state.name,
                password: this.state.password,
              },
            },
          })
            .then((data) => {
              //삭제 후 다시  Mypage로 navigate
              this.props.navigation.navigate('Mypage', {
                edit_user: data.data.results,
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      //유효조건을 하나라도 만족하지 않으면 입력 확인해달라는 alert
      Alert.alert('필수 입력조건을 만족해주세요.');
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
        <NavigationEvents onDidFocus={(payload) => {}} />
        <View>
          <Text
            style={{
              marginTop: 30,
              fontSize: 24,
              fontWeight: '300',
            }}
          >
            약 올림
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
              개인정보 수정
            </Text>
          </View>
          <Text>수정할 정보를 입력하지 않으실 경우 기존의 정보로 유지됩니다.</Text>
        </View>
        <ScrollView>
          {/* -- 이름 입력 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 18,
                fontWeight: 'bold',
                color: '#6a9c90',
              }}
            >
              이름
            </Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="이름을 입력하세요."
              placeholderTextColor={'gray'}
              maxLength={12}
              onChangeText={(nameValue) => this.handleSignUpValue('name', nameValue)}
              defaultValue={this.state.name}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedName}</Text>

          {/* -- 전화번호 입력 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.seclectText}>전화번호</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="아이디를 찾을 때 사용됩니다."
              placeholderTextColor={'gray'}
              maxLength={11}
              onChangeText={(phoneNumberValue) =>
                this.handleSignUpValue('phoneNumber', phoneNumberValue)
              }
              defaultValue={this.state.phoneNumber}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedPhoneNumber}</Text>

          {/* -- 이메일 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 18,
                fontWeight: 'bold',
                color: '#6a9c90',
              }}
            >
              이메일
            </Text>
            <Text style={styles.placeholderText}>{this.state.useremail}</Text>
          </View>

          {/* -- 비밀번호 입력 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.seclectText}>비밀번호</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="비밀번호를 입력하세요."
              placeholderTextColor={'gray'}
              maxLength={16}
              secureTextEntry={true}
              onChangeText={(passwordValue) => this.handleSignUpValue('password', passwordValue)}
              defaultValue={this.state.password}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedPassword}</Text>

          {/* -- 비밀번호 확인 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.seclectText}>비밀번호 확인</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="맞게 입력되었는지 확인!"
              placeholderTextColor={'gray'}
              maxLength={16}
              secureTextEntry={true}
              onChangeText={(passwordCheckValue) =>
                this.handleSignUpValue('passwordCheck', passwordCheckValue)
              }
              defaultValue={this.state.passwordCheck}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedPasswordCheck}</Text>

          {/* -- 확인 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20, marginLeft: -20 }}>
            <TouchableOpacity onPress={this.editUserInfo}>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 15,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#6a9c90',
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>변경하기</Text>
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
    marginTop: 30,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a9c90',
  },
  placeholderText: {
    textAlign: 'right',
    fontSize: 18,
    width: window.width - 40,
    padding: 10,
    paddingBottom: 5,
  },
  nonAvailableText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9a6464',
  },
});
