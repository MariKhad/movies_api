module.exports = {
  async up(db, client) {
    await db
      .collection('playlists')
      .updateMany({}, { $rename: { user: 'createdBy' } });
  },

  async down(db, client) {
    await db
      .collection('playlists')
      .updateMany({}, { $rename: { createdBy: 'user' } });
  },
};
