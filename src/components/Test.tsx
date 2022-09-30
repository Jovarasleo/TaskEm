import { useState } from "react";
export default function Tester() {
  const [number, setNumber] = useState<number>(0);
  return (
    <>
      <div>TESTING HMR</div>
      <div>{number}</div>
      <button onClick={() => setNumber(number + 1)}>add number</button>
    </>
  );
}
