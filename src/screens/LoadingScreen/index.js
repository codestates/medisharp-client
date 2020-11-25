import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

export default class LoadingScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  async componentDidMount() {
    const value = await getItem();
    if (value !== null) {
      console.log(value);
      //this.setState({ isAuthorized: true });
      console.log('success');
      this.props.navigation.replace('TabNavigator');
    } else {
      console.log('failed');
      this.props.navigation.replace('LoginScreen');
    }
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <Image
          style={{
            top: '20%',
            width: 310 * 0.85,
            height: 111 * 0.85,
          }}
          source={require('../../img/loginMain.png')}
        />
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
