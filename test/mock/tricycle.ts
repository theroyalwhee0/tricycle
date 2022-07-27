import { Tricycle } from "../../src/tricycle";

export class MockTricycle extends Tricycle {

}

export function mockTricycle(): MockTricycle {
    return new MockTricycle();
}