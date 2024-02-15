module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany({}, { $unset: { token: 1 } });
  },

  async down(db, client) {
    await db.collection('users').updateMany({}, { $set: { token: 1 } });
  },
};
