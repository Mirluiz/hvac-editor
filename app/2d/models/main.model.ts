import { uuid } from "../../utils";

class Main {
  id: string;

  constructor() {
    this.id = uuid();
  }
}

export default Main;
