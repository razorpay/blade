const cssBezierToArray = <
  X1 extends number,
  Y1 extends number,
  X2 extends number,
  Y2 extends number
>(
  cssCubicBezierString: `cubic-bezier(${X1}, ${Y1}, ${X2}, ${Y2})`,
): [X1, Y1, X2, Y2] => {
  const indexOfFirstBracket = cssCubicBezierString.indexOf('(');
  const indexOfLastBracket = cssCubicBezierString.lastIndexOf(')');
  const bezierValuesString = cssCubicBezierString.slice(
    indexOfFirstBracket + 1,
    indexOfLastBracket,
  );
  const bezierValuesArray = bezierValuesString.split(',').map((val) => Number(val)) as [
    X1,
    Y1,
    X2,
    Y2,
  ];
  return bezierValuesArray;
};

export { cssBezierToArray };
