const chartDivID = 'chart1';
const chart = $('#' + chartDivID)

const italyFteAsIsSelector = '#fte_as_is_italy';
const italyFteToBeSelector = '#fte_to_be_italy';
const regioneFteAsIsSelector = '#fte_as_is_regione';
const regioneFteToBeSelector = '#fte_to_be_regione';
const regioneNameSelector = '#regioneName';
const regioneSectionSelector = '#regioneSection';
const $regioneSection = $(regioneSectionSelector);

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
    makeRegioniPlot()
    setRegioneClickHandler()
})

const makeRegioniPlot = function() {
    const data = [getFteAsIsTrace(), getFteToBeTrace()];
    const layout = {
        barmode: 'group',
    };
    Plotly.newPlot('chart1', data, layout);
}

const setRegioneClickHandler = function () {
    const regioneData = {};
    chart.on('plotly_click', function (event,data) {
        // console.log(data)
        regioneData.name = data.points[0].x;
        regioneData.fteasis = data.points[0].y;
        regioneData.ftetobe = data.points[1].y;
        console.log(regione, regioneData)
        // fill summary data
        setRegioneData(regioneData)
        // create regione chart
        makeAslPlot('chartRegione', regioneData.fteasis, regioneData.ftetobe)
        // show regione section
        $regioneSection.removeClass('d-none')
        // navigate to regione section
        document.querySelector(regioneSectionSelector).scrollIntoView({
            behavior: 'smooth'
        });
    })
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
    $fteAsIs = $(italyFteAsIsSelector)
    $fteAsIs.text(numberWithDots(fteAsIsItalyValue))

    $fteToBe = $(italyFteToBeSelector)
    $fteToBe.text(numberWithDots(fteToBeItalyValue))
}

const setRegioneData = function (regioneData) {
    // name
    $regioneName = $(regioneNameSelector)
    $regioneName.text(regioneData.name)
    // fte as is
    $fteAsIs = $(regioneFteAsIsSelector)
    $fteAsIs.text(numberWithDots(regioneData.fteasis))
    // fte 2 be
    $fteToBe = $(regioneFteToBeSelector)
    $fteToBe.text(numberWithDots(regioneData.ftetobe))
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