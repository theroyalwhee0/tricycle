import { Tricycle } from "../../src/tricycle";
import { Mock } from './mock';

export class MockTricycle extends Tricycle {
    [Mock]: true
}

export function mockTricycle(): MockTricycle {
    return new MockTricycle();
}