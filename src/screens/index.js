import React from 'react';
import { Text, View, Dimensions, Image } from 'react-native';
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
import EditMyinfoScreen from './MypageScreen/EditMyinfo';
import CameraScreen from './CameraScreen';
import CameraNoticeScreen from './CameraNoticeScreen';
import CheckScreen from './CheckScreen';
import SelfInputScreen from './SelfInputScreen';
import AlarmUpdateScreen from './AlarmUpdateScreen';
import MedicineDetailScreen from './MedicineBoxScreen/MedicineDetailScreen';
import DeleteCheckScreen from './AlarmUpdateScreen/DeleteCheck';
import SignUpScreen from './LoginScreen/SignUp';
import FindIdScreen from './LoginScreen/FindId';
import FindPwScreen from './LoginScreen/FindPw';

const window = Dimensions.get('window');

const MypageStack = createStackNavigator(
  {
    Mypage: MypageScreen,
    LoginScreen: LoginScreen,
    EditMyinfoScreen: EditMyinfoScreen,
  },
  {
    initialRouteName: 'Mypage',
    headerMode: 'none',
    headerShown: false,
  },
);

const AlarmStack = createStackNavigator(
  {
    Alarm: AlarmScreen,
    SelfInputScreen: SelfInputScreen,
  },
  {
    initialRouteName: 'Alarm',
    headerMode: 'none',
    headerShown: false,
  },
);

const CalendarStack = createStackNavigator(
  {
    Calendar: CalendarScreen,
    AlarmUpdateScreen: AlarmUpdateScreen,
    SelfInputScreen: SelfInputScreen,
    DeleteCheck: DeleteCheckScreen,
  },
  {
    headerMode: 'none',
    headerShown: false,
  },
);

const MedicineBoxStack = createStackNavigator(
  {
    MedicineBox: MedicineBoxScreen,
    MedicineDetail: MedicineDetailScreen,
  },
  {
    headerMode: 'none',
    headerShown: false,
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Calendar: { screen: CalendarStack },
    Alarm: { screen: AlarmStack },
    MedicineBox: { screen: MedicineBoxStack },
    Mypage: { screen: MypageStack },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        if (routeName === 'Home' && focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/homeActive.png')}
              />
            </View>
          );
        }
        if (routeName === 'Home' && !focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/home.png')}
              />
            </View>
          );
        }
        if (routeName === 'Calendar' && focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/calendarActive.png')}
              />
            </View>
          );
        }
        if (routeName === 'Calendar' && !focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/calendar.png')}
              />
            </View>
          );
        }
        if (routeName === 'Alarm') {
          return (
            <View
              style={{
                backgroundColor: '#76a991',
                width: window.height * 0.06,
                height: window.height * 0.06,
                borderRadius: window.height * 0.06,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 30, fontWeight: '300', marginBottom: 5 }}>
                +
              </Text>
            </View>
          );
        }
        if (routeName === 'MedicineBox' && focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/medicineBoxActive.png')}
              />
            </View>
          );
        }
        if (routeName === 'MedicineBox' && !focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/medicineBox.png')}
              />
            </View>
          );
        }
        if (routeName === 'Mypage' && focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/mypageActive.png')}
              />
            </View>
          );
        }
        if (routeName === 'Mypage' && !focused) {
          return (
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'center',
                }}
                source={require('../../assets/mypage.png')}
              />
            </View>
          );
        }
      },
    }),
    tabBarOptions: {
      style: {
        borderTopColor: '#76a991',
        borderTopWidth: 0.8,
        borderStyle: 'solid',
        height: window.height * 0.1,
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
  SignUpScreen: SignUpScreen,
  FindIdScreen: FindIdScreen,
  FindPwScreen: FindPwScreen,
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
});
export default createAppContainer(AppStack);
