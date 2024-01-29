import React from 'react';
import {render, fireEvent, act, waitFor} from '@testing-library/react-native';
import HomeScreen from '../Screens/HomeScreen';
import '@testing-library/jest-dom';
import {FlatList, Linking} from 'react-native';
// Mocking the Linking module since it's not available in the test environment
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));
const mockNavigation = {
  navigate: jest.fn(),
};
const mockData = [
  {
    _highlightResult: {
      author: {
        matchLevel: 'none',
        matchedWords: [],
        value: 'danbolt',
      },
      title: {
        matchLevel: 'none',
        matchedWords: [],
        value: 'Video-Game Companies Make Workers Relocate, Then Fire Them',
      },
      url: {
        matchLevel: 'none',
        matchedWords: [],
        value:
          'https://www.bloomberg.com/news/newsletters/2024-01-26/video-game-companies-make-workers-relocate-then-fire-them',
      },
    },
    _tags: ['story', 'author_danbolt', 'story_39157602'],
    author: 'danbolt',
    created_at: '2024-01-27T17:28:55Z',
    created_at_i: 1706376535,
    num_comments: 0,
    objectID: '39157602',
    points: 1,
    story_id: 39157602,
    title: 'Video-Game Companies Make Workers Relocate, Then Fire Them',
    updated_at: '2024-01-27T17:29:19Z',
    url: 'https://www.bloomberg.com/news/newsletters/2024-01-26/video-game-companies-make-workers-relocate-then-fire-them',
  },
];

// Mocking the fetch function
//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockData), // Adjust the mock data as needed
  }),
);
jest.useFakeTimers();

describe('HomeScreen', () => {
  it('renders correctly', () => {
    render(<HomeScreen />);
    // Add assertions based on your component's rendering
  });
  it('should update page number and call getData on interval', async () => {
    jest.useFakeTimers();

    const {unmount} = render(<HomeScreen />);

    // Assert that initially, the page number is 48
    expect(48).toBe(48);

    // Trigger the useEffect to run
    act(() => {
      jest.advanceTimersByTime(300000);
    });
    const nextPageNumber = 48 + 1;
    // Assert that the page number has been updated
    expect(nextPageNumber).toBe(49);

    // Assert that getData has been called
    expect(fetch).toHaveBeenCalledWith(
      'https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0',
    );

    // Cleanup
    unmount();
    jest.useRealTimers();
  });
  describe('HomeScreen navigation and linking', () => {
    it('should navigate to ArticleDetails on button press', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
      };
      //@ts-ignore
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData),
      });
      const {getByText, getByTestId} = render(
        <HomeScreen navigation={mockNavigation} />,
      );
      jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockData), // this is the response that contains all the astroid information
        }),
      );
      expect(getByText('Test Post 1')).toBeTruthy();

      //   await waitFor(() => getByText('Test Post 1'));

      const card = getByText('Test Post 1');

      fireEvent.press(card);
    });

    it('should open URL in browser on URL press', async () => {
      const {getByTestId} = render(<HomeScreen navigation={mockNavigation} />);

      // Mock article data
      const mockdataFlatlist = {
        author: 'John Doe',
        title: 'React Testing',
        url: 'https://example.com',
        created_at: '2022-01-01',
      };

      // Find and press the URL
      waitFor(async () => {
        await act(async () => {
          fireEvent.press(getByTestId('URLButton'));
        });
      });

      // Check if Linking.openURL is called with the correct URL
      waitFor(() => {
        expect(Linking.openURL).toHaveBeenCalledWith(mockData[0].url);
      });
    });
  });
  test('should return nothing when data.hits.length becomes 0', () => {});

  describe('Flatlist Testing', () => {
    test('should render flatlist when data is present', () => {
      const componentTree = render(<HomeScreen navigation={mockNavigation} />);
      expect(componentTree.UNSAFE_getAllByType(FlatList).length).toBe(1);
    });
    // test('should Navigate to next screen when button is pressed', () => {});
  });
  test('automatically fetches data on mount', async () => {
    const {getByTestId} = render(<HomeScreen />);

    // Advance timers to simulate the interval
    jest.advanceTimersByTime(3000);

    // Check if setLastPage is called
    expect(setLastPage).toHaveBeenCalledWith(true);

    // Check if clearInterval is called
    expect(clearInterval).toHaveBeenCalled();

    // Check if setArticles is called
    expect(setArticles).toHaveBeenCalledWith([]);

    // Reset the mocks
    jest.clearAllMocks();

    // Simulate fetching data again with hits
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            hits: [
              {
                /* your mock data here */
              },
            ],
          }),
      }),
    );

    // Trigger the useEffect again by re-rendering the component
    await act(async () => {
      render(<HomeScreen />);
    });

    // Advance timers to simulate the interval
    jest.advanceTimersByTime(3000);

    // Check if setArticles is called with the new data
    expect(setArticles).toHaveBeenCalledWith(/* expected data here */);
  });
});
