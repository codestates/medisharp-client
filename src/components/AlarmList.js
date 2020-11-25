import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Alarm from './Alarm';

const renderItem = ({ item }) => {
  console.log('item:', item);

  return (
    <View>
      <View>
        <Text>user id: {item[2][1]}</Text>
      </View>
      <View>
        <Text>id: {item[2][2]}</Text>
      </View>
      <View>
        <Text>title: {item[2][3]}</Text>
      </View>
      <View>
        <Text>body: {item[1]}</Text>
      </View>
    </View>
  );
};

const AlarmList = (props) => {
  return (
    <View>
      <Text> 오늘의 알람</Text>
      <TouchableOpacity
      // onPress={}
      >
        <View>
          <FlatList data={props} renderItem={renderItem} keyExtractor={(item) => String(item.id)} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AlarmList;
