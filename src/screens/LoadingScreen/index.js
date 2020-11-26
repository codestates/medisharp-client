import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

//import * as SecureStore from 'expo-secure-store';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

export default class LoadingScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: false,
    };
  }

  // async componentDidMount() {
  //   const value = await getItem();
  //   if (value !== null) {
  //     console.log(value);
  //     //this.setState({ isAuthorized: true });
  //     console.log('success');
  //     this.props.navigation.replace('TabNavigator');
  //   } else {
  //     console.log('failed');
  //     this.props.navigation.replace('LoginScreen');
  //   }
  // }

  // read = async () => {
  //   try {
  //     const credentials = await SecureStore.getItemAsync('yag_olim');
  //     if (credentials) {
  //       console.log('success');
  //       this.setState({ isAuthorized: true });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  read = async () => {
    try {
      const value = await getItem();
      if (value) {
        console.log('success');
        this.setState({ isAuthorized: true });
        //this.props.navigation.replace('TabNavigator');
      }
    } catch (e) {
      console.log(e);
    }
  };

  async componentDidMount() {
    await this.read();
    if (this.state.isAuthorized === true) {
      this.props.navigation.replace('TabNavigator');
    } else {
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
