const CODICE_REGIONE_KEY = 'Codice Regione';
const REGIONE_KEY = 'Descrizione Regione';
const FTE_AS_IS_KEY = 'FTE AS IS';
const FTE_TO_BE_KEY = 'FTE TO BE';

const numberWithDots = function(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}


const getUniqueValues = (rows) => rows.reduce( function(acc,curr) {
    if ( ! acc.includes(curr) ) acc.push(curr);
    return acc;
}, []);

const getCodiciRegioni = function (rows) {
    return getUniqueValues(unpack(rows, CODICE_REGIONE_KEY))
}

const getRegioni = function (rows) {
    const codiciRegioni = getCodiciRegioni(rows)
    const regioni = [];
    $.each(codiciRegioni, function(index, codiceRegione) {
        // find regione name
        regioneRow = rows.find(row => row[CODICE_REGIONE_KEY] === codiceRegione)
        // create object
        regione = {}
        regione.codice = codiceRegione
        regione.nome = regioneRow[REGIONE_KEY]
        // put object in array
        regioni.push(regione)
    })
    return regioni;
}

const getTraces = function ( rows ) {
    console.log('rows', rows.length)
    // for (var i=0; i < rows.length; i++) {
    //     row = rows[i];
    //     console.log('row', row)
    // }
}

function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
}

const aggregateData = function (data, aggregate)
{
    switch (aggregate) {
        case 'regione':
            console.log('aggregating for regione');
            /*
            FB_aggregateDateArray = FB_dateArray.map(function(date) { return date.split('-')[0]; });
            TA_aggregateDateArray = TA_dateArray.map(function(date) { return date.split('-')[0]; });
            */
            socials_aggregate_date_array = data.map(
                date_array => date_array.map(
                    date => date.split('-')[0]
                )
            );
            console.log(socials_aggregate_date_array);
            tick_step = "M12";
            break;
    }
}