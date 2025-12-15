import Navbar from "./components/navbar/navbar";

import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import HeroSection from "./components/heroSection/heroSection";
import Overview from "./components/settlementOverview/overview";
import ImportantUpdate from "./components/importantUpdate/importantUpdate";
import PaymentOverview from "./components/paymentOverview/paymentOverview";
import TopInsights from "./components/topInsights/topInsights";
import ProductsForYou from "./components/productsForYou/productsForYou";

function App() {
  return (
    <>
      <Navbar />
      <div className="containerWrapper">
        <Sidebar />
        <div className="pageContainer">
          <HeroSection />
          <Overview />
          <ImportantUpdate />
          <PaymentOverview />
          <TopInsights />
          <ProductsForYou />
        </div>
      </div>
    </>
  );
}

export default App;
