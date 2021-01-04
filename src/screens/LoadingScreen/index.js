import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Text, View, Image, StyleSheet, Alert } from 'react-native';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem, removeItem } = useAsyncStorage('@yag_olim');

export default class LoadingScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.restart();
  }

  restart = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios({
          method: 'get',
          url: 'http://127.0.0.1:5000/users/isloading',
        })
          .then(() => {
            if (token) {
              this.props.navigation.replace('TabNavigator');
            } else {
              this.props.navigation.replace('LoginScreen');
            }
          })
          .catch((err) => {
            //503에러 또는 500에러인 경우
            Alert.alert(
              '네트워크에 문제가 발생하였습니다.',
              '다시 시도해주세요',
              [{ text: '다시 시도', onPress: () => this.restart() }],
              { cancelable: true },
            );
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };


  render() {
    return (
      <View style={styles.loginContainer}>
        <Image
          style={{
            top: '40%',
            width: 310 * 0.85,
            height: 111 * 0.85,
          }}
          source={require('../../img/loginMain.png')}
        />
        <Text
          style={{
            color: '#649A8D',
            fontSize: 11,
            alignItems: 'center',
            top: '80%',
          }}
        >
          Medisharp
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
});
