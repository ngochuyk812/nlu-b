//Import các thư viện cần dùng
var express = require('express');

const request = require('request');
const bodyParser = require('body-parser')
var app = express()
const fetch = require('node-fetch');
const moment = require("moment")
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

function compareDates(d1, d2, now){
  var parts =d1.split('/');
  var d1 = Date.parse(parts[2] + "-" + parts[1]+ "-"+parts[0] ) 
  parts = d2.split('/');
  var d2 = Date.parse(parts[2] + "-" + parts[1]+ "-"+parts[0] ) 
  parts = now.split('/');
  var now = Date.parse(parts[2] + "-" + parts[1]+ "-"+parts[0] ) 
  return d1 <= now && now <=  d2;
  }

const login = async (user, pass)=>{
  const response = await fetch('https://dkmh.hcmuaf.edu.vn/api/auth/login', {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'ASP.NET_SessionId=qqa2epgjh2xrlvl2e5tnrbfd',
        'Origin': 'https://dkmh.hcmuaf.edu.vn',
        'Referer': 'https://dkmh.hcmuaf.edu.vn/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    },
    body: `username=${user}&password=${pass}&grant_type=password`
});
return response.text();
}

app.post("/login", async(req,res)=>{
 const body = await login(req.body.username, req.body.pass)
  console.log(body);
res.send(JSON.stringify(body))
})
app.get("/tkb/:token", async (req,res)=>{
  console.log(req.params.token);
var headers = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
  'Authorization': 'Bearer '+ req.params.token,
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Cookie': 'ASP.NET_SessionId=qqa2epgjh2xrlvl2e5tnrbfd',
  'Origin': 'https://dkmh.hcmuaf.edu.vn',
  'Referer': 'https://dkmh.hcmuaf.edu.vn/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"'
};

var dataString = '{"filter":{"hoc_ky":20222,"ten_hoc_ky":""},"additional":{"paging":{"limit":100,"page":1},"ordering":[{"name":null,"order_type":null}]}}';

var options = {
  url: 'https://dkmh.hcmuaf.edu.vn/api/sch/w-locdstkbtuanusertheohocky',
  method: 'POST',
  headers: headers,
  body: dataString
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
      let listAll = JSON.parse(body).data.ds_tuan_tkb
      // var date = moment();
      // var now = date.format('DD/MM/YYYY');
      // for(let i =0 ; i <listAll.length ; i++){
      //   let element = listAll[i]
      //   if(compareDates(element.ngay_bat_dau, element.ngay_ket_thuc,now)){
      //     data.push(element)
      //     data.push(listAll[i+1])
      //     break
      //   }
      // }
      
      res.send(JSON.stringify(listAll))
  }
}

request(options, callback);
})
// Khởi tạo server tại port 4000
app.listen(process.env.PORT || 2011);
