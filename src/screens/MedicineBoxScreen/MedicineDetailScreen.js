import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';

const window = Dimensions.get('window');

export default class MedicineDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
      MedicineName: '',
      MedicineEffect: '',
      MedicineCapacity: '',
    };
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: window.height * 0.92 - 1,
          paddingLeft: 20,
          paddingTop: getStatusBarHeight(),
        }}
      >
        <NavigationEvents
          onDidFocus={(payload) => {
            let item = this.props.navigation.getParam('MedicineData');
            this.setState({ uri: '받아온 uri' });
            this.setState({ MedicineName: item['name'] });
            this.setState({ MedicineEffect: item['effect'] });
            this.setState({ MedicineCapacity: item['capacity'] });
          }}
        />

        {/* -- 상단 타이틀 -- */}
        <Text
          style={{
            marginTop: 30,
            fontSize: 24,
          }}
        >
          약통
        </Text>
        <View
          style={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
            alignSelf: 'flex-start',
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 5,
              fontSize: 20,
              fontWeight: 'bold',
              paddingBottom: 5,
            }}
          >
            내가 복용하는 모든 약
          </Text>
        </View>
        <ScrollView>
          {/* -- 약 사진 -- */}
          <Image
            source={require('../../img/sampleMedi.png')} // 하드코딩입니닷 this.state.uri 로 대체될듯합니닷
            style={{
              width: window.width - 40,
              height: window.width - 40,
              // resizeMode: 'contain',  실제로 구현될때는 바로 위 하이트 값 삭제하고 리사이즈모드를 살리면 될듯합니닷!
              marginBottom: 10,
              borderRadius: 50,
            }}
          />

          {/* -- 약 이름 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              width: window.width - 40,
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 22,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              {this.state.MedicineName}
            </Text>
          </View>

          {/* -- 약 효능/효과 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.titleText}>효능/효과</Text>
            <Text style={styles.bodyText}>{this.state.MedicineEffect}</Text>
          </View>

          {/* -- 약 용법/용량 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.titleText}>용법/용량</Text>
            <Text style={styles.bodyText}>{this.state.MedicineCapacity}</Text>
          </View>

          {/* -- 삭제하기 버튼 -- */}
          <View style={{ alignItems: 'center', marginLeft: -20 }}>
            <TouchableOpacity onPress={() => console.log('삭제하기 눌려따!')}>
              <View
                style={{
                  justifyContent: 'center',
                  margin: 20,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#9a6464',
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                  }}
                >
                  삭제하기
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  viewBox: {
    marginBottom: window.height * 0.005,
    width: window.width - 40,
    borderBottomWidth: 1,
    borderBottomColor: '#6A9C90',
    borderStyle: 'solid',
  },
  titleText: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  bodyText: {
    paddingLeft: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
  },
});
