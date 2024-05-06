const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const detailThreadUseCase = new DetailThreadUseCase({});

    // Action & Assert
    await expect(detailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };
    const detailThreadUseCase = new DetailThreadUseCase({});

    // Action & Assert
    await expect(detailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const mockThread = new DetailThread({
      id: useCasePayload.threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2024-04-28T07:46:00.000Z',
      username: 'dicoding',
      comments: [],
    });
    const mockComments = [new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-04-28T07:46:00.000Z',
      content: 'Super Comment',
      likeCount: 0,
      isDelete: false,
      replies: [],
    })];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    // Creating use case instance
    const showThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await showThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(new DetailThread({
      id: useCasePayload.threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2024-04-28T07:46:00.000Z',
      username: 'dicoding',
      comments: [new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2024-04-28T07:46:00.000Z',
        content: 'Super Comment',
        isDelete: false,
      })],
    }));
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
