const ThreadsTableTestHelper = require('../../../../tests/ThreadsTabletTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread('user-123', addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread('user-123', addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread id is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should return thread correctly when id is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        created: '2024-04-28T07:46:00.000Z',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual(new DetailThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: '2024-04-28T07:46:00.000Z',
        username: 'dicoding',
        comments: [],
      }));
    });
  });
});
