// // Package Installation: npm install tradingeconomics
// const te = require("tradingeconomics");

// const IndicatorsExample = async () => {
//   try {
//     // Login with client key or leave it blank and a sample of data will be provided, you can get your free key here: http://developer.tradingeconomics.com
//     await te.login('7d3afa8ddf244e0:wlcw69hf6rzy76w');

//     //Get latest updates
//     const data = await te.getLatestUpdates()

//     //Get lastest updates by country or starting date (date format is yyyy/mm/dd)
//     const data1 = await te.getLatestUpdates(start_date = '2018-01-01')
//     const data2 = await te.getLatestUpdates(country = 'portugal')
//     const data3 = await te.getLatestUpdates(country = 'portugal', start_date = '2018-01-01')

//     //Get lastest updates by date (date format is yyyy/mm/dd) and time (hh:mm)
//     const data4 = await te.getLatestUpdates(start_date = '2021-10-18', time='15:20')

//     {<p>
//       {data4}
//     </p>} //Place one of the variables to test
//   } catch (e) {
//     console.log(`Error: ${e}`);
//   }
// };

// export default IndicatorsExample();
