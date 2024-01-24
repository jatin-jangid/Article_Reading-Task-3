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
  // let intervalId: any;
  // useEffect(() => {
  //   // Fetch initial data
  //   getData();

  //   // Set up interval to fetch new data every 10 seconds
  //   // if (lastpage == true) {
  //   intervalRef.current = setInterval(getData, 5000);
  //   const intervalId = setInterval(() => {
  //     // setPage(prevPage => prevPage + 1);
  //     //   console.log(page, 'page');
  //     //   getData();
  //   }, 3000);
  //   // setIntervalId(
  //   //   setInterval(() => {
  //   //     getData();
  //   //   }, 10000),
  //   // );
  //   // const intervalId = setInterval(() => {
  //   //   getData();
  //   // }, 10000);
  //   // }

  //   // Clean up interval when the component is unmounted
  //   // return () => clearInterval(intervalId);

  // }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getData();
      let p = pageNumber + 1;
      // setPage(prevPage => prevPage + 1);
      console.log(p, 'page ');
      setPage(p);
    }, 3000);

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);
  // useEffect(() => {
  //   getData();
  // });
  // useEffect(() => {
  //   // console.log(pageNumber, 'Page Number');
  //   getData();
  // }, [pageNumber]);

  const getData = async () => {
    // if (isFetching || lastpage) {
    //   // If already fetching data, skip the new request
    //   return;
    // }

    // setIsFetching(true);
    try {
      setIsFetching(true);
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`,
      );
      const data = await response.json();
      const NewData = data.hits;
      setArticles(prev => [...prev, ...NewData]);
      console.log('Page Number 1', pageNumber);
      // setPage(prevPage => prevPage + 1);
      // console.log('Page Number 2', pageNumber);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }

    // let URL = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`;
    // fetch(URL)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data.hits.length, data.page, URL);
    //     if (data.hits.length == 0) {
    //       setLastPage(true);
    //       clearInterval(intervalRef.current);
    //       return;
    //     }
    //     setArticles(prevArticles => [...prevArticles, ...data.hits]);
    //     setPage(prev => prev + 1);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })
    //   .finally(() => {
    //     setIsFetching(false);
    //   });
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
        // onEndReached={lastpage ? null : getData}
        onEndReached={
          lastpage
            ? null
            : () => {
                // setPage(prevPage => prevPage + 1);
                // getData();
              }
        }
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
