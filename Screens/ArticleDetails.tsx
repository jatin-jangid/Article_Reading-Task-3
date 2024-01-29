import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';

class ArticleDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: this.props.route.params.data,
    };
  }

  handleLinkPress = () => {
    const {data} = this.state;
    if (data._highlightResult.url.value) {
      Linking.openURL(data._highlightResult.url.value);
    }
  };

  render() {
    const {data} = this.state;
    const mobileW = Dimensions.get('window').width;
    const mobileH = Dimensions.get('window').height;
    const jsonString = JSON.stringify(data, null, 2);

    return (
      <ScrollView>
        {jsonString != null ? (
          <Text>nothing</Text>
        ) : (
          <View style={styles.container}>
            <Text style={{color: 'green', fontWeight: '700'}}>
              RAW JSON of Article with Author : {data.author}
            </Text>
            <Text style={styles.jsonText}>{jsonString}</Text>
            {data._highlightResult.url.value && (
              <TouchableOpacity onPress={this.handleLinkPress}>
                <Text style={styles.linkText}>
                  {data._highlightResult.url.value}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    );
  }
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
