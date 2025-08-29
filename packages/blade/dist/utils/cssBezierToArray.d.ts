declare const cssBezierToArray: <X1 extends number, Y1 extends number, X2 extends number, Y2 extends number>(cssCubicBezierString: `cubic-bezier(${X1}, ${Y1}, ${X2}, ${Y2})`) => [X1, Y1, X2, Y2];
export { cssBezierToArray };
