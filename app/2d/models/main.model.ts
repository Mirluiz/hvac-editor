import { uuid } from "../../utils";

class Main {
  id: string;
  z: number = 0;

  constructor() {
    this.id = uuid();
  }
}

export default Main;
