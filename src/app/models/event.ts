export class Event {
  
  constructor(
    private id: String, private name: String, private by: String, private owner: String,
    private where: String, private startDate: Date, private endDate: Date, private creationDate: Date) {}

  getStartDate() {
      return this.startDate;
  }

  getEndDate() {
      return this.endDate;
  }
}
