import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';

const window = Dimensions.get('window');

export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.getParam('name'),
      phoneNumber: this.props.navigation.getParam('phoneNumber'),
      useremail: this.props.navigation.getParam('useremail'),
      password: this.props.navigation.getParam('password'),
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
        this.setState({ [key]: value });
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
        this.setState({ [key]: value });
      }
    }
    if (key === 'useremail') {
      var emailreg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      var useremail = value;
      this.setState({ [key]: useremail });
      if (useremail.length > 0 && false === emailreg.test(useremail)) {
        this.setState({ isAvailedEmail: '올바른 이메일 형식이 아닙니다.' });
      } else {
        this.setState({ isAvailedEmail: '' });
        axios({
          method: 'post',
          url: '',
          data: {
            useremail: value,
          },
        })
          .then((res) => {
            if (res.data !== null) {
              this.setState({ isAvailedEmail: '이미 존재하는 email입니다.' });
            } else {
              this.setState({ isAvailedEmail: '' });
              this.setState({ [key]: useremail });
            }
          })
          .catch((err) => {
            console.error(err);
          });
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
        this.setState({ [key]: value });
      }
    }
    if (key === 'passwordCheck') {
      var passwordCheck = value;
      if (passwordCheck.length > 0 && this.state.password !== passwordCheck) {
        this.setState({ isAvailedPasswordCheck: '비밀번호가 일치하지 않습니다.' });
      } else {
        this.setState({ isAvailedPasswordCheck: '' });
        this.setState({ [key]: value });
      }
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

          {/* -- 이메일 입력 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.seclectText}>이메일 주소</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="이메일 주소가 ID가 됩니다 :)"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(useremailValue) => this.handleSignUpValue('useremail', useremailValue)}
              defaultValue={this.state.useremail}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedEmail}</Text>

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
            <TouchableOpacity
              onPress={() => {
                console.log('들어올 때는 마음대로였겠지만 나갈 때는 아니란다!');
              }}
            >
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
