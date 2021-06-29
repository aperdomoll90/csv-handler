const fs = require('fs')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'results.csv',
    header: [
        {id: 'URL', title: 'URL'},
        {id: 'Age', title: 'Age'},
        {id: 'Date', title: 'Date '}
    ]
});

const arr=[]
const domainArr=[]


fs.createReadStream('test.csv')
.pipe(csv({}))
.on('data',(data)=>arr.push(data))
.on('data',(data)=>domainArr.push(data.URL))
.on('end', () => {
    const domainPart = domainArr.map(domain => { 
        const parts = domain.split('/')
        return parts[2]
      })
      console.log(domainPart)
    let uniqUsers = [...arr.reduce((map, obj) => map.set(!obj.URL==domainPart,obj),new Map()).values()]
    
    csvWriter.writeRecords(uniqUsers)    
    .then(() => {
        console.log(uniqUsers,'...Done');
    });
    // console.log(uniqUsers)
  })

 

