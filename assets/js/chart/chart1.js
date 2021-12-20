const fteAsIsID = 'fte_as_is_italy';
const fteToBeID = 'fte_to_be_italy';

let regioni = []
let fteAsIsItalyValue;
let fteToBeItalyValue;

Plotly.d3.csv(CSV_ENDPOINT, function(err, rows) {
    regioni = createRegioniArray(rows)
    console.log(regioni)
    fteAsIsItalyValue = aggregateValues(regioni, 'fteasis')
    fteToBeItalyValue = aggregateValues(regioni, 'ftetobe')
    // set ftes
    setItalyFTE()
    makePlot()
})

const makePlot = function() {
    const data = [getFteAsIsTrace(), getFteToBeTrace()];
    const layout = {
        barmode: 'group',
    };
    Plotly.newPlot('chart1', data, layout);
}

const getFteAsIsTrace = function () {
    const trace = [];
    trace.x = unpack(regioni, 'nome')
    trace.y = unpack(regioni, 'fteasis')
    trace.name = 'FTE AS IS'
    trace.type = 'bar'
    return trace;
}

const getFteToBeTrace = function () {
    return {
        x: unpack(regioni, 'nome'),
        y: unpack(regioni, 'ftetobe'),
        name: 'FTE TO BE',
        type: 'bar',
    }
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