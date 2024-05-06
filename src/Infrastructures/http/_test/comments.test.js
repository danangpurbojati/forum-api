const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTabletTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadResponseJson.data.addedThread;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        random: 'random property',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadResponseJson.data.addedThread;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadResponseJson.data.addedThread;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 401 when unauthenticated user create comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User & GET JWT Access Token
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      // Create Thread
      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadResponseJson.data.addedThread;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxx`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 401 when unauthenticated user delete comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 when user not the owner of comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User & GET JWT Access Token
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingrandom',
          password: 'secret',
          fullname: 'Dicoding Random Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const loginResponseRandom = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingrandom',
          password: 'secret',
        },
      });

      const loginResponseRandomJson = JSON.parse(loginResponseRandom.payload);
      const { accessToken: accessTokenRandom } = loginResponseRandomJson.data;

      // Create Thread
      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadResponseJson.data.addedThread;

      // Create Comment
      const commentPayload = {
        content: 'comment content',
      };

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentResponseJson.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessTokenRandom}` },
      });

      // Assert
      expect(response.statusCode).toEqual(403);
    });

    it('should response 200 and success delete comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Create User & GET JWT Access Token
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      // Create Thread
      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const { id: threadId } = threadResponseJson.data.addedThread;

      // Create Comment
      const commentPayload = {
        content: 'comment content',
      };

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const { id: commentId } = commentResponseJson.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
