import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';

interface Article {
  author: string;
  title: string;
  url: string;
  created_at: string;
}

interface HomeScreenState {
  articles: Article[];
  pageNumber: number;
  isFetching: boolean;
  lastpage: boolean;
  searchQuery: string;
}

class HomeScreen extends Component<any, HomeScreenState> {
  private intervalId: any;

  constructor(props: any) {
    super(props);

    this.state = {
      articles: [],
      pageNumber: 0,
      isFetching: false,
      lastpage: false,
      searchQuery: '',
    };
  }

  componentDidMount() {
    // this.getData();
    this.intervalId = setInterval(this.fetchData, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  fetchData = () => {
    this.getData();
    this.setState(
      prevState => ({pageNumber: prevState.pageNumber + 1}),
      // this.getData,
    );
  };

  getData = async () => {
    const {isFetching, lastpage, pageNumber} = this.state;

    if (isFetching || lastpage) {
      return;
    }

    this.setState({isFetching: true});

    const URL = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`;

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        console.log(data.hits.length, data.page, URL);

        if (data.hits.length === 0) {
          this.setState({lastpage: true});
          clearInterval(this.intervalId);
          return;
        }

        this.setState(prevState => ({
          articles: [...prevState.articles, ...data.hits],
        }));
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.setState({isFetching: false});
      });
  };

  renderFooter = () => {
    if (!this.state.lastpage) {
      return <ActivityIndicator size="large" color="gray" />;
    }
  };

  filterArticles = (articles: Article[], query: string): Article[] => {
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(
      article =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.author.toLowerCase().includes(lowercaseQuery),
    );
  };

  handleSearch = () => {
    this.setState(
      {
        articles: [],
        pageNumber: 0,
        lastpage: false,
      },
      this.getData,
    );
  };

  render() {
    const {navigation} = this.props;
    const {articles, searchQuery} = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          testID="search-query"
          style={styles.searchBar}
          placeholder="Search by title or author"
          placeholderTextColor={'black'}
          onChangeText={text => this.setState({searchQuery: text})}
          value={searchQuery}
          onSubmitEditing={this.handleSearch}
        />
        <FlatList
          testID="flatlist"
          data={this.filterArticles(articles, searchQuery)}
          renderItem={({item}) => (
            <View style={styles.itemView}>
              <TouchableWithoutFeedback
                testID="ArticleDetailsButton"
                onPress={() => {
                  navigation.navigate('ArticleDetails', {
                    data: item,
                  });
                }}>
                <View>
                  <Text style={styles.itemViewText}>Author: {item.author}</Text>
                  <Text style={styles.itemViewText}>Title: {item.title}</Text>

                  <TouchableOpacity
                    testID="URLButton"
                    onPress={() => {
                      Linking.openURL(item.url);
                    }}>
                    <Text style={styles.itemViewText}>
                      URL: <Text style={{color: 'blue'}}>{item.url}</Text>
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.itemViewText}>
                    Created At: {item.created_at}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          onEndReached={this.state.lastpage ? null : this.fetchData}
          onEndReachedThreshold={0.3}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    width: '90%',
    color: 'black',
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  itemViewText: {
    color: 'black',
  },
  searchBar: {
    height: 45,
    borderColor: 'gray',
    width: '90%',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    alignSelf: 'center',
    color: 'black',
    borderRadius: 10,
  },
});
