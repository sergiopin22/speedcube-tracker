import Dexie from 'dexie';

const db = new Dexie('SpeedcubeDB');

db.version(1).stores({
  solves: '++id, puzzle, time, date, sessionId, scramble, penalty, comment',
  sessions: '++id, name, puzzle, createdAt'
});

db.version(2).stores({
  solves: '++id, puzzle, time, date, sessionId, scramble, penalty, comment',
  sessions: '++id, name, puzzle, createdAt, userId'
});

export default db;
