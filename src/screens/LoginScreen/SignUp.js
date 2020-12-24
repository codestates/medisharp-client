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

export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phoneNumber: '',
      useremail: '',
      password: '',
      passwordCheck: '',
      isAvailedName: '',
      isAvailedPhoneNumber: '',
      isAvailedEmail: '',
      isAvailedPassword: '',
      isAvailedPasswordCheck: '',
    };
  }

  checkEmail = (email) => {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/users/email',
      params: {
        email: email,
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data['status'] === 'OK') {
          this.setState({ isAvailedEmail: '' });
          this.setState({ key: email });
        } else {
          this.setState({ isAvailedEmail: '이미 존재하는 email입니다.' });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
        this.checkEmail(useremail);
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
        console.log(value);
        this.setState({ isAvailedPassword: '' });
        this.setState({ password: value });
      }
    }
    if (key === 'passwordCheck') {
      var passwordCheck = value;
      console.log('value:', value);
      console.log('this state:', this.state.password);
      if (passwordCheck.length > 0 && this.state.password !== passwordCheck) {
        this.setState({ isAvailedPasswordCheck: '비밀번호가 일치하지 않습니다.' });
      } else {
        this.setState({ isAvailedPasswordCheck: '' });
        this.setState({ passwordCheck: value });
      }
    }
  };

  onSignUp = () => {
    axios
      .post('http://127.0.0.1:5000/users/signup', {
        users: {
          email: this.state.useremail,
          password: this.state.password,
          full_name: this.state.name,
          mobile: this.state.phoneNumber,
        },
      })
      .then((res) => {
        console.log(res.data);
        this.props.navigation.navigate('LoginScreen');
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.onSignUp(),
            },
          ],
          { cancelable: false },
        );
      });
  };

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
            회원 가입하기
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
              placeholder="아이디를 찾을 때 사용됩니다."
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
              placeholder="이메일 주소가 ID가 됩니다 :)"
              placeholderTextColor={'#c4c4c4'}
              maxLength={30}
              onChangeText={(useremailValue) => this.handleSignUpValue('useremail', useremailValue)}
              defaultValue={this.state.eMail}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedEmail}</Text>

          {/* -- 비밀번호 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>비밀번호</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="비밀번호를 입력하세요."
              placeholderTextColor={'#c4c4c4'}
              maxLength={16}
              secureTextEntry={true}
              onChangeText={(passwordValue) => this.handleSignUpValue('password', passwordValue)}
              defaultValue={this.state.password}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedPassword}</Text>

          {/* -- 비밀번호 확인 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>비밀번호 확인</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="맞게 입력되었는지 확인!"
              placeholderTextColor={'#c4c4c4'}
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
          <View style={{ alignItems: 'center', marginTop: -10, marginBottom: 30, marginLeft: -20 }}>
            <TouchableOpacity
              onPress={() => {
                this.onSignUp();
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
                <Text style={{ fontSize: 20, color: 'white' }}>가입하기</Text>
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
