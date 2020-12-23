import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Text, View, Image, StyleSheet } from 'react-native';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem, removeItem } = useAsyncStorage('@yag_olim');

export default class LoadingScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
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
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
