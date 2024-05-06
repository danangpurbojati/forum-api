const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'comment',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: true,
      isDelete: 'true',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment',
      isDelete: false,
    };

    // Action
    const comment = new DetailComment(payload);

    // Assert
    expect(comment).toBeInstanceOf(DetailComment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
  });

  it('should create deleted comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'comment',
      isDelete: true,
    };

    // Action
    const comment = new DetailComment(payload);

    // Assert
    expect(comment).toBeInstanceOf(DetailComment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });
});
