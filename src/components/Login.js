import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

class Login extends Component {
  render() {
    return (
      <View style={styles.loginContainer}>
        <Image
          style={{ width: 310, height: 111, marginTop: '50%' }}
          source={require('../img/loginMain.png')}
        />
        <View style={styles.LoginBox}>
          <Text style={{ color: 'white', fontSize: 16 }}>ID</Text>
          <TextInput
            autoCompleteType={'email'}
            placeholder={'e-mail'}
            style={{
              borderRadius: 10,
              height: 40,
              width: 250,
              marginTop: 5,
              marginBottom: 10,
              backgroundColor: 'white',
              paddingLeft: 10,
            }}
          />
          <Text style={{ color: 'white', fontSize: 16 }}>Password</Text>
          <TextInput
            autoCompleteType={'password'}
            placeholder={'password'}
            keyboardType={'password'}
            secureTextEntry={true}
            style={{
              borderRadius: 10,
              height: 40,
              width: 250,
              marginTop: 5,
              marginBottom: 20,
              backgroundColor: 'white',
              paddingLeft: 10,
            }}
          />
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              width: 250,
              borderRadius: 30,
              height: 45,
              padding: 10,
              marginBottom: 30,
            }}
            onPress={this.onPress}
          >
            <Text style={{ color: '#649A8D', fontSize: 18, fontWeight: 'bold' }}>들어가기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FAE301',
              width: 250,
              borderRadius: 20,
              height: 60,
              padding: 10,
              marginBottom: 50,
              flexDirection: 'row',
            }}
            // onPress={this.onPress}
          >
            <Image
              style={{ width: 35, height: 40, marginRight: 30 }}
              source={require('../img/kakaoLogo.png')}
            />
            <Text style={{ color: '#391B1B', fontSize: 18, fontWeight: 'bold' }}>
              카카오 로그인
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  LoginBox: {
    borderRadius: 50,
    backgroundColor: '#8AB3A9',
    alignItems: 'center',
    justifyContent: 'center',
    height: '55%',
    width: '100%',
    marginTop: 100,
  },
});

export default Login;
