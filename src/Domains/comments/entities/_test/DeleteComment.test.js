const DeleteComment = require('../DeleteComment');

describe('DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create deleteComment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Action
    const { commentId, threadId } = new DeleteComment(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
  });
});
