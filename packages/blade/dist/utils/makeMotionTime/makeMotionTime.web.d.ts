import { MakeMotionTime } from './types';
import { Platform } from '..';
export declare const makeMotionTime: <T extends number>(time: T) => Extract<MakeMotionTime<T>, {
    __brand__?: "platform-web" | "platform-all" | undefined;
}>;
