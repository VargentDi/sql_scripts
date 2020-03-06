const fs = require("fs");
const fastcsv = require("fast-csv");
const Pool = require("pg").Pool;
var count = 0;

const pool = new Pool({
  host: "localhost",
  user: "gdocntlcloud",
  database: "gdocntlgeniedev",
  password: "Genie123",
  port: 5432
});
var table_name = ''
let csvFileName = '';
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    // connect to the PostgreSQL database
    pool.connect((err, client, done) => {
      if (err) throw err;
      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(query)
              console.log(err.stack);
            } else {
            }
          });
        });
      } finally {
        done();
      }
    });
    // save csvData
  });


var readline = require('readline-sync');
csvFileName = readline.question("whats your file name? ").trim()
table_name = readline.question("whats the table? ").trim()
console.log('csvfile name is ', csvFileName);
console.log('table name is ', table_name)
const query =
  `INSERT INTO ${table_name} (mac_address, serial_number, created_at, genie_internal_number, test_result) VALUES ($1, $2, $3, $4, $5)`;
console.log('query is ', query)
let stream = fs.createReadStream(`${csvFileName}.csv`); // put csv file name here

const main = async () => {
  await stream.pipe(csvStream);
  console.log(`rows get successfully inserted into db,\n table name: ${table_name} `)

}

main()


