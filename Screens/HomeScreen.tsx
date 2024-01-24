import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface Article {
  author: string;
  title: string;
  url: string;
  created_at: string;
}

function HomeScreen({navigation}: any) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pageNumber, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [lastpage, setLastPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  //   const [intervalId, setIntervalId] = useState();
  const intervalRef = useRef<NodeJS.Timeout>();
  let intervalId: any;
  useEffect(() => {
    // Fetch initial data
    getData();

    // Set up interval to fetch new data every 10 seconds
    // if (lastpage == true) {
    intervalRef.current = setInterval(getData, 5000);
    // setIntervalId(
    //   setInterval(() => {
    //     getData();
    //   }, 10000),
    // );
    // const intervalId = setInterval(() => {
    //   getData();
    // }, 10000);
    // }

    // Clean up interval when the component is unmounted
    // return () => clearInterval(intervalId);

    return () => clearInterval(intervalRef.current);
  }, []);

  const getData = () => {
    if (isFetching || lastpage) {
      // If already fetching data, skip the new request
      return;
    }
    setIsFetching(true);

    let URL = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`;
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        console.log(data.hits.length, data.page, URL);
        if (data.hits.length == 0) {
          setLastPage(true);
          clearInterval(intervalRef.current);
          return;
        }
        setArticles(prevArticles => [...prevArticles, ...data.hits]);
        setPage(pageNumber + 1);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const renderFooter = () => {
    // If fetching data, render a loading indicator
    if (!lastpage) {
      return <ActivityIndicator size="large" color="gray" />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        // initialNumToRender={5}
        // maxToRenderPerBatch={5}
        data={articles}
        renderItem={({item, index}) => (
          <View style={styles.itemView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ArticleDetails', {
                  data: item,
                });
              }}>
              <Text style={styles.itemViewText}>Author : {item.author}</Text>
              <Text style={styles.itemViewText}>Title : {item.title}</Text>
              <Text style={styles.itemViewText}>URL : {item.url}</Text>
              <Text style={styles.itemViewText}>
                Created At : {item.created_at}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={lastpage ? null : getData}
        // onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
      {/* {isFetching && <ActivityIndicator size="large" color="gray" />} */}
    </View>
  );
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
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  itemViewText: {
    color: 'black',
  },
});
