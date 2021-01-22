import React, { useState } from 'react';
import './App.css';

function App() {

  var [stockName, setStockName] = useState('');
  var [stockQty, setStockQty] = useState(0);
  var [buyDate, setBuyDate] = useState('');
  var [outputData, setOutput] = useState('');
  var [outputCurrency, setOutputCurrency] = useState('INR');
  var [stockExchange, setStockExchange] = useState('BSE:');
  var [plData, setPL] = useState();

  function calculatePL(event) {
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockExchange}${stockName}&outputsize=full&apikey=HKKVL1O7VHKTKMR1`)
    .then(res => res.json())
    .then((data) => {
      Object.keys(data).map(() => {
        var buydateRate = data['Time Series (Daily)'][`${buyDate}`]['3. low'];
        var latestDate = data['Meta Data']['3. Last Refreshed'];
        var latestRate = data['Time Series (Daily)'][`${latestDate}`]['3. low'];
        var pl = stockQty * (Number(latestRate) - Number(buydateRate));
        var plpercent;
        if(pl<0) {
          setPL('loss');
          pl = Math.abs(pl);
          plpercent = (pl/(Number(buydateRate)*stockQty))*100;
          plpercent = plpercent.toFixed(2);
          pl = pl.toFixed(2);
          setOutput(`You lost ${pl} ${outputCurrency} ↓(${plpercent}%)`);
        }
        else {
          setPL('profit');
          plpercent = (pl/(Number(buydateRate)*stockQty))*100;
          plpercent = plpercent.toFixed(2);
          pl = pl.toFixed(2);
          setOutput(`You gained ${pl} ${outputCurrency} ↑(${plpercent}%)`);
        }
      });
    })
    .catch(() => {
      setOutput("Please enter the valid details");
    });

    event.preventDefault();

  }

  return (
    <div className="App">

      <h1>Profit or Loss on your stock?</h1>

      <div className="container container-center">

        <form onSubmit={calculatePL}>
        
          <label>Stock Symbol:
            <input type="text" onChange={(event) => setStockName(event.target.value)} />
          </label>

          <div id="div-radio" onChange={(event) => setStockExchange(event.target.value)}>
            <span>Stock Exchange:</span>
            <label id="label-radio">
            <input type="radio" id="btn-radio" name="stockexchange" value="BSE:" defaultChecked onChange={() => setOutputCurrency("INR")} />
            BSE</label>
            <label id="label-radio">
            <input type="radio" id="btn-radio" name="stockexchange" value="" onChange={() => setOutputCurrency("USD")} />
            NYSE</label>
          </div>

          <label>Quantity:
            <input type="number" onChange={(event) => setStockQty(event.target.value)} />
          </label>

          <label>Date when you bought it:
            <input type="date" placeholder="dd/mm/yyyy" onChange={(event) => setBuyDate(event.target.value)} />
          </label>
          
          <input type="submit" id="btn-calculate" value="Calculate" />

        </form>

        <h3>{outputData}</h3>

      </div>

      <footer>
          <div>Built by <a href="https://sai-karthik.netlify.app/">Sai Karthik</a> </div>
      </footer>

    </div>
  );
}

export default App;
