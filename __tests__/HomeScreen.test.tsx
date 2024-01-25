import React from 'react';
import {render, fireEvent, act, waitFor} from '@testing-library/react-native';
import HomeScreen from '../Screens/HomeScreen';
import '@testing-library/jest-dom';
import {Linking} from 'react-native';

// Mocking the Linking module since it's not available in the test environment
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));
const mockNavigation = {
  navigate: jest.fn(),
};
const mockData = {
  data: {
    hits: [
      {
        title: 'Test Post 1',
        author: 'Test Author 1',
        story_id: '1',
        url: 'google.com',
        _tags: 'tag',
        created_at: 'Date',
      },
      {
        title: 'Test Post 2',
        author: 'Test Author 2',
        story_id: '2',
        url: 'google.com',
        _tags: 'tag',
        created_at: 'Date',
      },
    ],
  },
};

// Mocking the fetch function
//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockData), // Adjust the mock data as needed
  }),
);

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
      jest.advanceTimersByTime(3000);
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
      const mockItem = {
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
        expect(Linking.openURL).toHaveBeenCalledWith(mockItem.url);
      });
    });
  });

  //Another SHIT
  //   describe('ArticleList component', () => {
  //     const mockNavigation = {
  //       navigate: jest.fn(),
  //     };

  //     const mockArticle = {
  //       author: 'John Doe',
  //       title: 'Sample Title',
  //       url: 'https://example.com',
  //       created_at: '2022-01-25T12:00:00Z',
  //     };

  //     const mockData = [mockArticle];

  //     it('renders the list of articles correctly', () => {
  //       const {getByText, getByTestId} = render(
  //         <HomeScreen navigation={mockNavigation} articles={mockData} />,
  //       );

  //       // Verify that the rendered data is correct
  //       expect(getByText(`Author: ${mockArticle.author}`)).toBeTruthy();
  //       expect(getByText(`Title: ${mockArticle.title}`)).toBeTruthy();
  //       expect(getByTestId('URLButton')).toBeTruthy();
  //       expect(getByText(`Created At: ${mockArticle.created_at}`)).toBeTruthy();
  //     });

  //     it('navigates to ArticleDetails when ArticleDetailsButton is pressed', () => {
  //       const {getByTestId} = render(
  //         <HomeScreen navigation={mockNavigation} articles={mockData} />,
  //       );

  //       // Trigger the onPress event on ArticleDetailsButton
  //       fireEvent.press(getByTestId('ArticleDetailsButton'));

  //       // Verify that the navigate function is called with the correct parameters
  //       expect(mockNavigation.navigate).toHaveBeenCalledWith('ArticleDetails', {
  //         data: mockArticle,
  //       });
  //     });

  //     it('opens the URL in the browser when URLButton is pressed', async () => {
  //       const {getByTestId} = render(
  //         <HomeScreen navigation={mockNavigation} articles={mockData} />,
  //       );

  //       // Trigger the onPress event on URLButton
  //       fireEvent.press(getByTestId('URLButton'));

  //       // Wait for the asynchronous code to complete
  //       await act(async () => {
  //         await waitFor(() => {
  //           // Verify that Linking.openURL is called with the correct URL
  //           expect(Linking.openURL).toHaveBeenCalledWith(mockArticle.url);
  //         });
  //       });
  //     });
  //   });
});
