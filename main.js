const fs = require('fs')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'deduped.csv',
    header: [
        {id: 'URL', title: 'URL'},
        {id: 'Age', title: 'Age'},
        {id: 'Date', title: 'Date '}
    ]
});

const arr=[]
const domainArr=[]

fs.createReadStream('source.csv')
.pipe(csv({}))
.on('data',(data)=>arr.push(data))
.on('data',(data)=>domainArr.push(data.URL.split('/')[2]))
.on('end', () => {
    const uniqUsers = [...arr.reduce((map, obj) => map.set(obj.URL.split('/')[2],obj),new Map()).values()]
    // This line iterates through the array using a higher order function.
    // We pass a function through it with an accumulator value(map) and a variable to place the objects/iterations in (obj)
    // Set a new empty Map as initial value
    // By using .set to add to the accumulator any object that meets the key( in this case a parsed domain ) overwriting the one previously there if there was a duplicated

    // creates an array of the counted domains for Json object
    let domainCount = {}
    for (var i = 0; i < domainArr.length; i++) {
        domainCount[domainArr[i]] = domainCount[domainArr[i]] + 1 || 1 ;
    }
    

    //creates CSV file
    csvWriter.writeRecords(uniqUsers)    
    .then(() => {
        console.log(uniqUsers,'csv created');
    });

     //creates JSON file
    const myJSON = JSON.stringify(domainCount);
    fs.writeFile('./count.json', myJSON, err => {
        if (err){
            console.log(err)
        }else {
            console.log(myJSON,'json created');
        }
    })
    
  })

 

