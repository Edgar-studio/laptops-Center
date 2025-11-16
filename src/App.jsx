import './App.css'
import Pages from "./Pages/Pages.jsx";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";

function App() {


    return (
        <div className='w-full min-h-screen '>
            <Header/>
            <Pages/>
            <Footer/>
        </div>

    )
}

export default App
