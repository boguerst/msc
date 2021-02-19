import { Event } from './event';

describe('Event', () => {
  it('should create an instance', () => {
    const event = {uid: '1', name: 'evt1', by: 'user1', owner: 'owner1', where: 'where1',
      startDate: new Date(), endDate: new Date(), creationDate: new Date()};
    expect(event).toBeTruthy();
  });
});
