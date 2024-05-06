const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 123,
      body: 'abc',
      date: '2024-04-28T07:46:00.000Z',
      username: 123,
      comments: {},
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detail thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2024-04-28T07:46:00.000Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const thread = new DetailThread(payload);

    // Assert
    expect(thread).toBeInstanceOf(DetailThread);
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
  });
});
