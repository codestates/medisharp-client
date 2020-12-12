import React from 'react';
import { View, Text } from 'react-native';

export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'ah, ah, mic test',
    };
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{this.state.test}</Text>
      </View>
    );
  }
}
