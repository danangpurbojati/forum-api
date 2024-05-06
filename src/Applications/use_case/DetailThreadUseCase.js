class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  _verifyPayload(payload) {
    const { threadId } = payload;
    if (!threadId) {
      throw new Error('DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { threadId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    thread.comments = comments;
    return thread;
  }
}

module.exports = DetailThreadUseCase;
