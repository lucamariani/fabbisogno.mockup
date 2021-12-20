const fteAsIsID = 'fte_as_is_italy';
const fteToBeID = 'fte_to_be_italy';

let regioni = []
let fteAsIsItalyValue;
let fteToBeItalyValue;

Plotly.d3.csv(CSV_ENDPOINT, function(err, rows) {
    regioni = createRegioniArray(rows)
    fteAsIsItalyValue = aggregateValues(regioni, 'fteasis')
    fteToBeItalyValue = aggregateValues(regioni, 'ftetobe')
    // set ftes
    setItalyFTE()
})

const makePlot = function() {
    const data = [trace1, trace2];
    const layout = {barmode: 'stack'};
    Plotly.newPlot('myDiv', data, layout);
}

/**
 * Parse rows and create array with regione objects.
 * @param rows
 * @returns {*|[]}
 */
const createRegioniArray = function (rows) {
    const regioni = getRegioni(rows)
    $.each(regioni, function (index, regione) {
        console.debug(regione)
        regione.fteasis = aggregate(rows, CODICE_REGIONE_KEY, regione.codice, FTE_AS_IS_KEY);
        regione.ftetobe = aggregate(rows, CODICE_REGIONE_KEY, regione.codice, FTE_TO_BE_KEY);
    })
    return regioni;
}

const setItalyFTE = function () {
    $fteAsIs = $('#' + fteAsIsID)
    $fteAsIs.text(numberWithDots(fteAsIsItalyValue))

    $fteToBe = $('#' + fteToBeID)
    $fteToBe.text(numberWithDots(fteToBeItalyValue))
}

/**
 * Sum all the aggregateField values for items with key aggregateOnKey equals to aggregateOnValue
 * @param data_array
 * @param aggregateOnKey
 * @param aggregateOnValue
 * @param aggregateField
 */
const aggregate = function (data_array, aggregateOnKey, aggregateOnValue, aggregateField) {
    const arrayFilteredOnKeys = data_array.filter((value) =>  value[aggregateOnKey] === aggregateOnValue);
    return aggregateValues(arrayFilteredOnKeys, aggregateField)
}

const aggregateValues = function (data_array, aggregateField) {
    const values = unpack(data_array, aggregateField)
    console.debug('values', values)
    return values.reduce((acc,curr) => parseFloat(acc) + parseFloat(curr));
}