import { WebView } from 'react-native-webview';

const SocialWebview = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={this.javaScriptEnabledprops.source}
        javaScriptEnabled={true}
      />
    </SafeAreaView>
  );
};
export default SocialWebview;
