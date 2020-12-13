import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './HomeScreen';
import LoadingScreen from './LoadingScreen';
import CalendarScreen from './CalendarScreen';
import AlarmScreen from './AlarmScreen';
import MedicineBoxScreen from './MedicineBoxScreen';
import LoginScreen from './LoginScreen';
import MypageScreen from './MypageScreen';
import CameraScreen from './CameraScreen';
import CameraNoticeScreen from './CameraNoticeScreen';
import CheckScreen from './CheckScreen';
import SelfInputScreen from './SelfInputScreen';
import AlarmUpdateScreen from './AlarmUpdateScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';

const window = Dimensions.get('window');

const AlarmStack = createStackNavigator({
  Alarm: AlarmScreen,
  SelfInputScreen: SelfInputScreen,
  AlarmUpdateScreen: AlarmUpdateScreen,
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Calendar: { screen: CalendarScreen },
    Alarm: { screen: AlarmStack },
    MedicineBox: { screen: MedicineBoxScreen },
    Mypage: { screen: MypageScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        if (routeName === 'Home') {
          return (
            <View>
              <Icon name="home" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
        if (routeName === 'Calendar') {
          return (
            <View style={{ paddingRight: 10 }}>
              <Icon name="calendar-alt" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
        if (routeName === 'Alarm') {
          return (
            <View
              style={{
                backgroundColor: '#6a9c90',
                width: window.height * 0.09,
                height: window.height * 0.06,
                borderRadius: window.height * 0.06,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <Icon name="clock" size={25} color={(focused && '#6a9c90') || '#888'} /> */}
              <Text style={{ color: 'white', fontSize: 30, fontWeight: '800', marginBottom: 5 }}>
                +
              </Text>
            </View>
          );
        }
        if (routeName === 'MedicineBox') {
          return (
            <View style={{ paddingLeft: 10 }}>
              <Icon name="pills" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
        if (routeName === 'Mypage') {
          return (
            <View>
              <Icon name="user-alt" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
      },
    }),
    tabBarOptions: {
      style: {
        borderTopColor: '#6a9c90',
        borderTopWidth: 1,
        borderStyle: 'solid',
        height: window.height * 0.08,
      },
      showLabel: false,
    },
  },
);

const AppStack = createStackNavigator({
  LoadingScreen: LoadingScreen, // 3번 로딩 화면 보기를 위해 급하게 만들었습니다. 이걸 없애면 첫화면이 로그인 화면이 됩니다.
  LoginScreen: LoginScreen,
  CameraStack: CameraScreen,
  CheckScreen: CheckScreen,
  CameraNoticeScreen: CameraNoticeScreen,
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
});
export default createAppContainer(AppStack);
