import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { setItem } = useAsyncStorage('@yag_olim');

export default class LoginScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
  }

  // _refWebView = (webview) => {
  //   if (webview.ref === null) {
  //     return;
  //   }
  //   this.webview = webview;
  // };

  INJECTED_JAVASCRIPT =
    '(function() {if(window.document.getElementsByTagName("pre").length>0){window.ReactNativeWebView.postMessage((window.document.getElementsByTagName("pre")[0].innerHTML));}})();';

  _handleMessage = async (event) => {
    console.log(JSON.parse(event.nativeEvent.data));
    let result = JSON.parse(event.nativeEvent.data);
    let success = result.message;
    if (success) {
      let userToken = result.Authorization;
      console.log('success');
      try {
        console.log('success');
        await setItem(userToken);
      } catch (e) {
        console.log(e);
      }
    }
    this.props.closeSocialModal();
  };

  render() {
    return (
      <WebView
        //ref={this._refWebView}
        originWhitelist={['*']}
        injectedJavaScript={this.INJECTED_JAVASCRIPT}
        useWebKit={true}
        source={this.props.source}
        javaScriptEnabled={true}
        onMessage={this._handleMessage}
      />
    );
  }
}

// const SocialWebview = (props) => {
//   return (
//     <WebView
//       ref={_refWebView}
//       originWhitelist={['*']}
//       injectedJavaScript={INJECTED_JAVASCRIPT}
//       source={props.source}
//       javaScriptEnabled={true}
//       onMessage={_handleMessage}
//     />
//   );
// };
// export default SocialWebview;

// const _refWebView = (webview) => {
//   console.log(webview.ref);
//   if (webview) {
//     this.webview = webview;
//   }
// };

// const INJECTED_JAVASCRIPT =
//   '(function() {if(window.document.getElementsByTagName("pre").length>0){window.ReactNativeWebView.postMessage((window.document.getElementsByTagName("pre")[0].innerHTML));}})();';

// const _handleMessage = async (event) => {
//   console.log(JSON.parse(event.nativeEvent.data));
//   let result = JSON.parse(event.nativeEvent.data);
//   let success = result.message;
//   if (success) {
//     let userToken = result.Authorization;
//     console.log('success');
//     try {
//       await setItem(userToken);
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   props.closeSocialModal();
// };
