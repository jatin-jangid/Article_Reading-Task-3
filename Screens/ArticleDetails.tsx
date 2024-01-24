import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';

function ArticleDetails({navigation, route}: any) {
  const {data} = route.params;
  const mobileW = Dimensions.get('window').width;
  const mobileH = Dimensions.get('window').height;
  const jsonString = JSON.stringify(data, null, 2);

  const handleLinkPress = () => {
    if (data._highlightResult.url.value) {
      Linking.openURL(data._highlightResult.url.value);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{color: 'green', fontWeight: '700'}}>
          RAW JSON of Article with Author : {data.author}
        </Text>
        <Text style={styles.jsonText}>{jsonString}</Text>
        {data._highlightResult.url.value && (
          <TouchableOpacity onPress={handleLinkPress}>
            <Text style={styles.linkText}>
              {data._highlightResult.url.value}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  jsonText: {
    fontSize: 14,
    textAlign: 'left',
    margin: 10,
    fontFamily: 'monospace',
    color: 'black',
  },
  linkText: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
    margin: 10,
  },
});

export default ArticleDetails;
