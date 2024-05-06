const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(deleteComment.threadId);
    await this._commentRepository.verifyAvailableComment(deleteComment.commentId);
    await this._commentRepository.verifyCommentOwner(userId, deleteComment.commentId);
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
