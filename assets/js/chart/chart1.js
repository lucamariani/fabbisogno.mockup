console.log('csv',CSV_ENDPOINT)

d3.csv(CSV_ENDPOINT, function(err, rows) {
    getTraces(rows)
})