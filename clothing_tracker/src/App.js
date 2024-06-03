import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddClothingForm from './components/Add_Clothing';
import ClothingTable from './components/display_options';
import ClothingCard from './components/clothing_card';

function App() {
  return (
   <>
    <AddClothingForm/>
    <ClothingTable/>
    <ClothingCard/>
   </>
  );
}

export default App;
