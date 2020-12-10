import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default class CheckScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      uri: this.props.navigation.getParam('uri'),
      getImg: '../../img/loginMain.png',
      mediname: this.props.navigation.getParam('mediname'),
    };
  }

  async componentDidMount() {
    const getImg = await FileSystem.getInfoAsync(this.state.uri);
    console.log(getImg['uri']);
    this.setState({ getImg: getImg['uri'] });
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <Image style={{ width: 300, height: 300 }} source={{ uri: this.state.getImg }} />
        <Text>{this.state.mediname}</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#313131' }}>
            이 약이 맞아요!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#313131' }}>
            직접 등록할래요!
          </Text>
        </TouchableOpacity>
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
