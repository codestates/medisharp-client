import React from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './HomeScreen';
import CalendarScreen from './CalendarScreen';
import AlarmScreen from './AlarmScreen';
import MedicineBoxScreen from './MedicineBoxScreen';
import LoginScreen from './LoginScreen';
import MypageScreen from './MypageScreen';
import HomeIcon from '../img/Home.png';
import calendarIcon from '../img/calendar.png';
import alarmIcon from '../img/alarm.png';
import medicineBoxIcon from '../img/medicineBox.png';
import myPageIcon from '../img/myPage.png';

const HomeStack = createStackNavigator(
  {
    HomeScreen,
  },
  // if you need.
  // recommend custom header
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Home',
      headerShown: false,
    }),
  },
);
const CalendarStack = createStackNavigator(
  {
    CalendarScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Calendar',
      headerShown: false,
    }),
    initialRouteName: 'CalendarScreen',
  },
);
const AlarmStack = createStackNavigator(
  {
    AlarmScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Alarm',
      headerShown: false,
    }),
    initialRouteName: 'AlarmScreen',
  },
);
const MedicineBoxStack = createStackNavigator(
  {
    MedicineBoxScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'MedicineBox',
      headerShown: false,
    }),
    initialRouteName: 'MedicineBoxScreen',
  },
);
const MypageStack = createStackNavigator(
  {
    MypageScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Mypage',
      headerShown: false,
    }),
    initialRouteName: 'MypageScreen',
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Calendar: CalendarStack,
    Alarm: AlarmStack,
    MedicineBox: MedicineBoxStack,
    Mypage: MypageStack,
  },
  {
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#6a9c90',
      inactiveTintColor: '#888',
    },
  },
);

const AppStack = createStackNavigator({
  LoginScreen: LoginScreen,
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
});
export default createAppContainer(AppStack);
