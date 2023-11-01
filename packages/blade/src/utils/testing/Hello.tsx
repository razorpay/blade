import React from 'react';

const Hello = (): React.ReactElement => {
  const [date, setDate] = React.useState(() => Date.now());

  React.useEffect(() => {
    requestAnimationFrame(() => {
      setDate(Date.now());
    });
  }, []);

  return <div>Current date: {date}</div>;
};

export { Hello };
