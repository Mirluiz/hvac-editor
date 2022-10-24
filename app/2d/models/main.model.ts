import { uuid } from "../../utils";

class Main {
  _id: string;

  constructor() {
    this._id = uuid();
  }
}

export default Main;
