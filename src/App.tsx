import Test from "./components/Test";
function App() {
  console.log("doesnt work");
  return (
    <div>
      <Test page="https://google.com">{<div>Hello</div>}</Test>
    </div>
  );
}
export default App;
